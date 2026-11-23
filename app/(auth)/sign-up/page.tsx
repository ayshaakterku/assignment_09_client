'use client'

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { authClient } from "@/lib/auth-client"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { toast } from "react-toastify"
// shadcn toast (<Toaster /> must be in the root layout)

type Role = "tutor" | "student" | "admin"

// Explicit colors so the form stays readable on the white card
// even if your shadcn theme tokens are light/dark-mode values.
const labelClass = "text-xs font-semibold text-foreground";
const inputClass =
  "h-10 rounded-md border border-input bg-background text-sm text-foreground shadow-none placeholder:text-muted-foreground focus-visible:border-fuchsia-600 focus-visible:ring-2 focus-visible:ring-fuchsia-500/20 dark:bg-input/30";
const textareaClass =
  "min-h-20 rounded-md border border-input bg-background py-2 text-sm text-foreground shadow-none placeholder:text-muted-foreground focus-visible:border-fuchsia-600 focus-visible:ring-2 focus-visible:ring-fuchsia-500/20 dark:bg-input/30";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2 MB

const roles: { value: Role; label: string; icon: string }[] = [
  {
    value: "tutor",
    label: "Tutor",
    icon: "M12 14l9-5-9-5-9 5 9 5zm0 0v6m-6-8.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5",
  },
  {
    value: "student",
    label: "Student",
    icon: "M17 20h5v-2a4 4 0 00-5-3.9M9 12a4 4 0 100-8 4 4 0 000 8zm-7 8v-1a5 5 0 015-5h4a5 5 0 015 5v1H2z",
  },
  // {
  //   value: "admin",
  //   label: "Admin",
  //   icon: "M12 3l8 3v6c0 5-3.4 9.3-8 11-4.6-1.7-8-6-8-11V6l8-3z",
  // },
]

function SignUpPage() {
  const router = useRouter();

  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [signupLoading, setSignupLoading] = useState<boolean>(false);
  const [role, setRole] = useState<Role>("student");

  // Profile image is uploaded to imgbb right away; only the hosted URL is
  // sent to better-auth (the `image` field on the user).
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageUploading, setImageUploading] = useState<boolean>(false);

  const clearImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview("");
    setImageUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image must be 5 MB or smaller.");
      e.target.value = "";
      return;
    }

    // Show the local preview instantly while imgbb is uploading.
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
    setImageUrl("");
    setImageUploading(true);

    try {
      const body = new FormData();
      body.append("image", file);

      const response = await fetch("/api/upload", { method: "POST", body });
      const result = (await response.json()) as { url?: string; message?: string };

      if (!response.ok || !result.url) {
        throw new Error(result.message ?? "Image upload failed.");
      }

      setImageUrl(result.url);
      toast.success("Profile image uploaded.");
    } catch (error) {
      URL.revokeObjectURL(preview);
      setImagePreview("");
      setImageUrl("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.error(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      setImageUploading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const user = Object.fromEntries(formData.entries()) as {
      name: string,
      email: string,
      phone: string,
      bio: string,
      password: string,
      confirmPassword: string,
    };

    const phone = user.phone?.trim() ?? "";
    const bio = user.bio?.trim() ?? "";

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    if (!passwordRegex.test(user.password)) {
      toast.error(
        "Password must be at least 8 characters and contain uppercase and lowercase letters."
      );
      return;
    }

    // Confirm password validation
    if (user.password !== user.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    // Optional phone validation
    if (phone && !/^\+?[0-9\s\-()]{7,20}$/.test(phone)) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    if (imageUploading) {
      toast.error("Please wait for the profile image to finish uploading.");
      return;
    }

    if (imagePreview && !imageUrl) {
      toast.error("The profile image upload failed. Remove it or try again.");
      return;
    }

    setSignupLoading(true);

    try {
      const { data, error } = await authClient.signUp.email({
        name: user.name,
        email: user.email,
        image: imageUrl || undefined,
        phone: phone || undefined,
        bio: bio || undefined,
        password: user.password,
        role,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data) {
        toast.success("Account created successfully!");
        setTimeout(() => {
          router.push("/");
        }, 1000);
      }

    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSignupLoading(false);
    }
  };

  // Google Signup
  const handleSignWithGoogle = async () => {
    setGoogleLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message ?? "Google authentication failed.");
        setGoogleLoading(false);
      }

    } catch {
      toast.error("Something went wrong. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <div>
      {/* top row */}
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-fuchsia-50 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-widest text-fuchsia-900 dark:bg-fuchsia-950/50 dark:text-fuchsia-200">
          Register
        </span>
        <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
          <svg className="h-3.5 w-3.5 text-fuchsia-700 dark:text-fuchsia-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1.2 14.6l-4-4 1.4-1.4 2.6 2.6 5-5 1.4 1.4-6.4 6.4z" />
          </svg>
          Quick setup
        </span>
      </div>

      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground">
        Create your account
      </h1>
      <p className="mt-1 text-xs text-muted-foreground">
        Select your role and sign up with Google or email.
      </p>

      <form onSubmit={handleEmailSignUp} className="mt-5">
        <FieldGroup>

          {/* Role cards */}
          {/* <div className="grid grid-cols-3 gap-3"> */}
          <div className="grid grid-cols-2 gap-3">
            {roles.map((r) => {
              const active = role === r.value;
              return (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  aria-pressed={active}
                  className={`relative flex flex-col items-center gap-2 rounded-xl border-2 px-2 py-3 transition ${
                    active
                      ? "border-fuchsia-700 bg-fuchsia-50 shadow-sm dark:border-fuchsia-400 dark:bg-fuchsia-950/40"
                      : "border-border bg-card hover:border-fuchsia-300 dark:hover:border-fuchsia-500"
                  }`}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-900 to-fuchsia-600 text-white">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={r.icon} />
                    </svg>
                  </span>
                  <span className="text-sm font-semibold text-foreground">{r.label}</span>
                  {active && (
                    <svg className="absolute right-1.5 top-1.5 h-4 w-4 text-teal-600 dark:text-teal-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1.2 14.6l-4-4 1.4-1.4 2.6 2.6 5-5 1.4 1.4-6.4 6.4z" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>

          <Field>
            <Button
              onClick={handleSignWithGoogle}
              variant="outline"
              type="button"
              disabled={googleLoading}
              className="h-10 border-input bg-background font-medium text-foreground shadow-none hover:bg-muted hover:text-foreground"
            >
              <Image
                src="/google.png"
                alt="Google logo"
                width={15}
                height={15}
              />
              {googleLoading ? "Connecting..." : "Sign up with Google"}
            </Button>
          </Field>

          <FieldSeparator className="text-muted-foreground *:data-[slot=field-separator-content]:bg-card *:data-[slot=field-separator-content]:text-muted-foreground">
            Or continue with
          </FieldSeparator>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel className={labelClass} htmlFor="name">Name</FieldLabel>
              <Input
                className={inputClass}
                id="name"
                name="name"
                type="text"
                placeholder="Aysha Akter"
                required
              />
            </Field>

            <Field>
              <FieldLabel className={labelClass} htmlFor="phone">
                Phone number{" "}
                <span className="font-normal text-muted-foreground">(optional)</span>
              </FieldLabel>
              <Input
                className={inputClass}
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+880 1XXXXXXXXX"
                pattern="^\+?[0-9\s\-()]{7,20}$"
              />
            </Field>
          </div>

          <Field>
            <FieldLabel className={labelClass} htmlFor="email">Email</FieldLabel>
            <Input
              className={inputClass}
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </Field>

          {/* Profile image upload (optional) */}
          <Field>
            <FieldLabel className={labelClass}>
              Profile image{" "}
              <span className="font-normal text-muted-foreground">(optional)</span>
            </FieldLabel>
            <div className="flex items-center gap-3 rounded-xl border border-dashed border-input bg-muted/30 p-3">
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-background">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Profile image preview"
                    width={56}
                    height={56}
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <svg className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM6.5 21a5.5 5.5 0 0111 0" />
                  </svg>
                )}
                {imageUploading && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={imageUploading}
                    className="border-input bg-background text-foreground shadow-none hover:bg-muted"
                  >
                    {imageUploading ? "Uploading..." : imagePreview ? "Change image" : "Choose image"}
                  </Button>
                  {imagePreview && !imageUploading && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearImage}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  JPG, PNG, WEBP or GIF. max 2 MB
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </Field>

          <Field>
            <FieldLabel className={labelClass} htmlFor="bio">
              Bio{" "}
              <span className="font-normal text-muted-foreground">(optional)</span>
            </FieldLabel>
            <Textarea
              className={textareaClass}
              id="bio"
              name="bio"
              placeholder="Department, Institution, Experience or what you want to learn."
              maxLength={300}
            />
            <FieldDescription>Up to 300 characters.</FieldDescription>
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel className={labelClass} htmlFor="password">Password</FieldLabel>
              <Input
                className={inputClass}
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                minLength={8}
                required
              />
            </Field>

            <Field>
              <FieldLabel className={labelClass} htmlFor="confirmPassword">Confirm Password</FieldLabel>
              <Input
                className={inputClass}
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Enter it again"
                minLength={8}
                required
              />
            </Field>
          </div>
          <FieldDescription className="-mt-3">
            Minimum 8 characters, including uppercase and lowercase letters.
          </FieldDescription>

          <Field>
            <Button
              type="submit"
              disabled={signupLoading || imageUploading}
              className="h-11 w-full gap-2 rounded-xl border-0 bg-fuchsia-800 font-bold text-white shadow-lg shadow-fuchsia-900/25 hover:bg-fuchsia-700"
            >
              {signupLoading ? "Creating Account..." : "Create account"}
              {!signupLoading && (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6l6 6-6 6" />
                </svg>
              )}
            </Button>

            <FieldDescription className="text-center">
              Have an account?{" "}
              <Link href="/sign-in" className="font-bold text-fuchsia-700 hover:underline dark:text-fuchsia-300">
                Login
              </Link>
            </FieldDescription>
            <FieldDescription className="text-center">
              Forgot your password?{" "}
              <Link href="/forgot-password" className="font-bold text-fuchsia-700 hover:underline dark:text-fuchsia-300">
                Reset it
              </Link>
            </FieldDescription>
          </Field>

        </FieldGroup>
      </form>

      <FieldDescription className="mt-4 text-center">
        By clicking continue, you agree to our{" "}
        <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}

export default SignUpPage;
