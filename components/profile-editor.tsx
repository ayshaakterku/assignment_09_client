"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  Camera,
  Check,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Trash2,
  UserRound,
} from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2 MB

const inputClass =
  "h-10 rounded-md border border-input bg-background pl-9 text-sm text-foreground shadow-none placeholder:text-muted-foreground focus-visible:border-fuchsia-600 focus-visible:ring-2 focus-visible:ring-fuchsia-500/20 dark:bg-input/30";

const textareaClass =
  "min-h-24 rounded-md border border-input bg-background py-2 text-sm text-foreground shadow-none placeholder:text-muted-foreground focus-visible:border-fuchsia-600 focus-visible:ring-2 focus-visible:ring-fuchsia-500/20 dark:bg-input/30";

const primaryButtonClass =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-fuchsia-700 to-purple-800 px-6 text-sm font-semibold text-white shadow-sm transition hover:brightness-110";

export type ProfileEditorUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  phone?: string | null;
  bio?: string | null;
  location?: string | null;
};

/**
 * Shared profile form used by `/profile` and by the "Update Profile" tab of
 * the admin, tutor and student dashboards. It writes straight to better-auth,
 * so every surface stays in sync.
 */
export function ProfileEditor({
  user,
  onSaved,
  showCancel = true,
  className,
}: {
  user: ProfileEditorUser;
  onSaved?: () => Promise<unknown> | void;
  showCancel?: boolean;
  className?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user.name ?? "");
  const [phone, setPhone] = useState(user.phone ?? "");
  const [location, setLocation] = useState(user.location ?? "");
  const [bio, setBio] = useState(user.bio ?? "");

  // `imageUrl` is the saved/hosted URL, `preview` is the local blob shown
  // while imgbb is still uploading.
  const [imageUrl, setImageUrl] = useState(user.image ?? "");
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const avatarSrc = preview || imageUrl;

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image must be 2 MB or smaller.");
      event.target.value = "";
      return;
    }

    if (preview) URL.revokeObjectURL(preview);

    const localPreview = URL.createObjectURL(file);
    const previousImage = imageUrl;
    setPreview(localPreview);
    setUploading(true);

    try {
      const body = new FormData();
      body.append("image", file);

      const response = await fetch("/api/upload", { method: "POST", body });
      const result = (await response.json()) as {
        url?: string;
        message?: string;
      };

      if (!response.ok || !result.url) {
        throw new Error(result.message ?? "Image upload failed.");
      }

      setImageUrl(result.url);
      toast.success("Profile photo uploaded.");
    } catch (uploadError) {
      URL.revokeObjectURL(localPreview);
      setPreview("");
      setImageUrl(previousImage);
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.error(
        uploadError instanceof Error
          ? uploadError.message
          : "Image upload failed."
      );
    } finally {
      setUploading(false);
    }
  };

  const clearImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview("");
    setImageUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanLocation = location.trim();
    const cleanBio = bio.trim();

    if (!cleanName) {
      setError("Name cannot be empty.");
      toast.error("Name cannot be empty.");
      return;
    }

    if (cleanPhone && !/^\+?[0-9\s\-()]{7,20}$/.test(cleanPhone)) {
      setError("Please enter a valid mobile number.");
      toast.error("Please enter a valid mobile number.");
      return;
    }

    if (uploading) {
      toast.error("Please wait for the photo to finish uploading.");
      return;
    }

    setSaving(true);

    try {
      const { error: updateError } = await authClient.updateUser({
        name: cleanName,
        image: imageUrl.trim() || null,
        phone: cleanPhone,
        location: cleanLocation,
        bio: cleanBio,
      });

      if (updateError) {
        setError(updateError.message || "Failed to update profile.");
        toast.error(updateError.message || "Failed to update profile.");
        return;
      }

      await onSaved?.();
      toast.success("Profile updated successfully!");
    } catch {
      setError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`overflow-hidden rounded-2xl border border-border bg-card shadow-sm ${className ?? ""}`}
    >
      {/* avatar + upload */}
      <div className="flex flex-col items-center gap-4 border-b border-border bg-gradient-to-br from-purple-50 via-white to-fuchsia-50 p-6 dark:from-purple-950/40 dark:via-card dark:to-fuchsia-950/30 sm:flex-row">
        <div className="relative shrink-0">
          <div className="flex size-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-purple-100 text-2xl font-extrabold text-purple-700 shadow-md dark:border-card dark:bg-purple-500/20 dark:text-purple-200">
            {avatarSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarSrc}
                alt={name || "Profile photo"}
                className="h-full w-full object-cover"
              />
            ) : (
              (name.trim().charAt(0) || user.email?.charAt(0) || "U").toUpperCase()
            )}
          </div>
          {uploading && (
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
              <Loader2 className="size-6 animate-spin text-white" />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1 text-center sm:text-left">
          <p className="truncate text-lg font-bold text-foreground">
            {name || "Your name"}
          </p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>

          <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || saving}
              className="gap-2 border-input bg-background text-foreground shadow-none hover:bg-muted"
            >
              <Camera className="size-4" />
              {uploading
                ? "Uploading..."
                : avatarSrc
                  ? "Change photo"
                  : "Upload photo"}
            </Button>
            {avatarSrc && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearImage}
                disabled={uploading || saving}
                className="gap-2 text-muted-foreground hover:text-red-600 dark:hover:text-red-400"
              >
                <Trash2 className="size-4" />
                Remove
              </Button>
            )}
          </div>

          <p className="mt-2 text-[11px] text-muted-foreground">
            JPG, PNG, WEBP or GIF. Max 2 MB.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
      </div>

      {/* fields */}
      <div className="grid gap-5 p-6 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="profile-name">Full name</Label>
          <div className="relative">
            <UserRound className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="profile-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              maxLength={80}
              autoComplete="name"
              placeholder="Your full name"
              className={inputClass}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="profile-email">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="profile-email"
              value={user.email ?? ""}
              readOnly
              disabled
              className={`${inputClass} opacity-70`}
            />
          </div>
          <p className="text-[11px] text-muted-foreground">
            Email cannot be changed here.
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="profile-phone">Mobile number</Label>
          <div className="relative">
            <Phone className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="profile-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              maxLength={20}
              placeholder="+880 1XXXXXXXXX"
              className={inputClass}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="profile-location">Location</Label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="profile-location"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              maxLength={120}
              placeholder="Dhanmondi, Dhaka"
              className={inputClass}
            />
          </div>
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="profile-bio">Short bio</Label>
          <Textarea
            id="profile-bio"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            rows={4}
            maxLength={300}
            placeholder="Tell us a little about yourself, your subjects or what you are looking for."
            className={textareaClass}
          />
          <p className="text-right text-[11px] text-muted-foreground">
            {bio.length}/300
          </p>
        </div>
      </div>

      {error && (
        <p className="px-6 pb-2 text-sm font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="flex flex-col-reverse items-center justify-end gap-3 border-t border-border bg-muted/30 px-6 py-4 sm:flex-row">
        {showCancel ? (
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-muted-foreground transition hover:text-foreground"
          >
            Cancel
          </Link>
        ) : null}
        <Button
          type="submit"
          disabled={saving || uploading}
          className={`${primaryButtonClass} w-full sm:w-auto`}
        >
          {saving ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check className="size-4" />
              Save changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export { primaryButtonClass as profilePrimaryButtonClass };
