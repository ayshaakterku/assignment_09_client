"use client"

import { useState } from "react"
import Image from "next/image"
import {
  BookOpen,
  Globe,
  ImagePlus,
  Loader2,
  MapPin,
  ShieldCheck,
  Trash2,
  UploadCloud,
} from "lucide-react"
import { toast } from "react-toastify"

import { createTutionData } from "@/components/api-update/tution-update"
import type {
  PostTuitionApplicationForm,
  TuitionApplication,
  TuitionMode,
} from "@/components/type/tution"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

import type { DashboardUser } from "./types"
import { Panel } from "./ui"
import { authClient } from "@/lib/auth-client"
import { getUserPremiumById } from "../api-access/users"
import {
  getStudentApplicationCount,
  getTutorTutionCount,
} from "../api-access/count"
import { redirect } from "next/navigation"
import { useRouter } from "next/navigation"

const MAX_BANNER_SIZE = 5 * 1024 * 1024 // 5 MB, matches /api/upload

export default function PostTuitionForm({
  user,
  onCreated,
}: {
  user: DashboardUser
  onCreated?: (tuition: TuitionApplication) => void
}) {
  const [mode, setMode] = useState<TuitionMode>("Online")
  const [bannerUrl, setBannerUrl] = useState("")
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const handleBannerChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = event.currentTarget
    const file = input.files?.[0]
    // Reset so choosing the same file again still fires onChange.
    input.value = ""

    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose a JPG, PNG, WEBP or GIF image.")
      return
    }

    if (file.size > MAX_BANNER_SIZE) {
      toast.error("Banner image must be 5 MB or smaller.")
      return
    }

    setUploading(true)

    try {
      const body = new FormData()
      body.append("image", file)

      const res = await fetch("/api/upload", { method: "POST", body })
      const json = (await res.json()) as { url?: string; message?: string }

      if (!res.ok || !json.url) {
        throw new Error(json.message ?? "Could not upload the banner image.")
      }

      setBannerUrl(json.url)
      toast.success("Banner image uploaded.")
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not upload the banner image."
      )
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const form = event.currentTarget
    const data = new FormData(form)

    const title = String(data.get("title") ?? "").trim()
    const subject = String(data.get("subject") ?? "").trim()
    const classLevel = String(data.get("classLevel") ?? "").trim()
    const location = String(data.get("location") ?? "").trim()
    const monthlyFee = Number(data.get("monthlyFee") ?? 0)
    const daysPerWeek = Number(data.get("daysPerWeek") ?? 0)
    const description = String(data.get("description") ?? "").trim()

    // check findoout id is premium or not
    const PremiumResult = await getUserPremiumById(user.id ?? "")
    // console.log("PremiumResult :", PremiumResult)

    // directed to payment page if number of post is greater than 2
    const tutorPostCount = await getTutorTutionCount(user.email ?? "")
    // console.log("tutorApplicationCount: ", tutorPostCount)

    // if id is not premium and free post is greater that two then redirect to payment page
    if (!PremiumResult.premium && tutorPostCount >= 2) {
      toast.error("You have already reached the limit")
      router.push("/payment")
      return
    }

    if (!title || !subject) {
      toast.error("Tuition title and subject are required.")
      return
    }

    if (!Number.isFinite(monthlyFee) || monthlyFee <= 0) {
      toast.error("Monthly fee must be greater than 0.")
      return
    }

    if (!Number.isFinite(daysPerWeek) || daysPerWeek < 1 || daysPerWeek > 7) {
      toast.error("Days per week must be between 1 and 7.")
      return
    }

    if (mode === "Offline" && !location) {
      toast.error("Please add a location for an offline tuition.")
      return
    }

    if (uploading) {
      toast.error("Please wait for the banner image to finish uploading.")
      return
    }

    // Tutor identity always comes from the signed-in account, never the form.
    if (!user.email) {
      toast.error("Your account email is missing. Please sign in again.")
      return
    }

    const payload: PostTuitionApplicationForm = {
      title,
      subject,
      classLevel,
      mode,
      location: mode === "Online" ? location || "Online" : location,
      monthlyFee,
      daysPerWeek,
      bannerImage: bannerUrl,
      description,
      tutorName: user.name?.trim() || "Tutor",
      tutorEmail: user.email,
      approvalStatus: "pending",
      isActive: true,
    }

    setSubmitting(true)

    try {
      const created = await createTutionData(payload)

      form.reset()
      setBannerUrl("")
      setMode("Online")
      toast.success(
        "Tuition submitted! It is pending admin approval before going public."
      )
      onCreated?.(created)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not post the tuition."
      )
    } finally {
      setSubmitting(false)
    }
  }

  const busy = submitting || uploading

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Panel className="p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-purple-50 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300">
              <BookOpen className="size-4" />
            </span>
            <div>
              <p className="text-sm font-bold text-foreground">
                Tuition information
              </p>
              <p className="text-xs text-muted-foreground">
                Details students will see on your listing.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="tuition-title">Tuition title</Label>
              <Input
                id="tuition-title"
                name="title"
                required
                maxLength={120}
                placeholder="e.g. Complete SSC Physics: Concept Clearing & Notes"
                className="h-10"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tuition-subject">Subject</Label>
              <Input
                id="tuition-subject"
                name="subject"
                required
                maxLength={80}
                placeholder="Physics"
                className="h-10"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tuition-class">Class / level</Label>
              <Input
                id="tuition-class"
                name="classLevel"
                maxLength={60}
                placeholder="Class 9 – 10"
                className="h-10"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Mode</Label>
              <div className="grid grid-cols-2 gap-2">
                {(["Online", "Offline"] as const).map((option) => {
                  const Icon = option === "Online" ? Globe : MapPin
                  const selected = mode === option

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setMode(option)}
                      aria-pressed={selected}
                      className={cn(
                        "flex h-10 items-center justify-center gap-2 rounded-lg border text-sm font-semibold transition",
                        selected
                          ? "border-purple-600 bg-purple-50 text-purple-700 dark:border-fuchsia-500/60 dark:bg-fuchsia-500/15 dark:text-fuchsia-300"
                          : "border-input bg-background text-muted-foreground hover:bg-muted/60"
                      )}
                    >
                      <Icon className="size-4" />
                      {option}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tuition-location">
                Location
                {mode === "Online" ? (
                  <span className="ml-1 font-normal text-muted-foreground">
                    (optional)
                  </span>
                ) : null}
              </Label>
              <Input
                id="tuition-location"
                name="location"
                maxLength={120}
                placeholder={
                  mode === "Online" ? "Online (live classes)" : "Uttara, Dhaka"
                }
                className="h-10"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tuition-fee">Monthly fee (BDT)</Label>
              <Input
                id="tuition-fee"
                name="monthlyFee"
                type="number"
                min={0}
                step={1}
                inputMode="numeric"
                required
                placeholder="5000"
                className="h-10"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tuition-days">Days per week</Label>
              <Input
                id="tuition-days"
                name="daysPerWeek"
                type="number"
                min={1}
                max={7}
                required
                placeholder="3"
                className="h-10"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="tuition-description">Description</Label>
              <Textarea
                id="tuition-description"
                name="description"
                rows={5}
                maxLength={2000}
                placeholder="Describe the tuition, requirements and what students can expect."
              />
            </div>
          </div>
        </Panel>

        <div className="space-y-5">
          <Panel className="p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-fuchsia-300">
                <ImagePlus className="size-4" />
              </span>
              <div>
                <p className="text-sm font-bold text-foreground">
                  Banner image
                </p>
                <p className="text-xs text-muted-foreground">
                  Uploaded to imgbb. JPG, PNG, WEBP or GIF, max 5 MB.
                </p>
              </div>
            </div>

            <div className="mt-4">
              {bannerUrl ? (
                <div className="space-y-2">
                  <div className="relative h-36 w-full overflow-hidden rounded-lg border border-border bg-muted">
                    <Image
                      src={bannerUrl}
                      alt="Tuition banner preview"
                      fill
                      unoptimized
                      sizes="(min-width: 1024px) 320px, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="size-3.5" />
                      Image uploaded
                    </span>
                    <button
                      type="button"
                      onClick={() => setBannerUrl("")}
                      disabled={busy}
                      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60 dark:text-red-400 dark:hover:bg-red-500/15"
                    >
                      <Trash2 className="size-3.5" />
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <label
                  className={cn(
                    "flex h-36 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-input bg-muted/30 px-4 text-center transition hover:border-purple-400 hover:bg-purple-50/40 dark:hover:border-fuchsia-500/50 dark:hover:bg-fuchsia-500/10",
                    uploading && "pointer-events-none opacity-70"
                  )}
                >
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleBannerChange}
                    className="sr-only"
                    disabled={uploading}
                  />
                  {uploading ? (
                    <Loader2 className="size-6 animate-spin text-purple-600 dark:text-fuchsia-400" />
                  ) : (
                    <UploadCloud className="size-6 text-muted-foreground" />
                  )}
                  <span className="text-xs font-semibold text-foreground">
                    {uploading
                      ? "Uploading image..."
                      : "Click to upload a banner"}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Recommended 1200 × 630 px
                  </span>
                </label>
              )}
            </div>
          </Panel>

          <Panel className="p-5 sm:p-6">
            <p className="text-sm font-bold text-foreground">Tutor details</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Filled automatically from your account.
            </p>

            <div className="mt-4 space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="tuition-tutor-name">Tutor name</Label>
                <Input
                  id="tuition-tutor-name"
                  value={user.name ?? ""}
                  readOnly
                  disabled
                  className="h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tuition-tutor-email">Tutor email</Label>
                <Input
                  id="tuition-tutor-email"
                  value={user.email ?? ""}
                  readOnly
                  disabled
                  className="h-10"
                />
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50/70 px-3 py-2.5 text-[11px] leading-5 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
              New tuitions are saved as{" "}
              <span className="font-bold">Pending</span> and{" "}
              <span className="font-bold">Active</span>. They become publicly
              visible after an admin approves them.
            </div>
          </Panel>
        </div>
      </div>

      <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          type="reset"
          variant="outline"
          disabled={busy}
          onClick={() => {
            setBannerUrl("")
            setMode("Online")
          }}
          className="h-10"
        >
          Clear form
        </Button>
        <Button
          type="submit"
          disabled={busy}
          className="h-10 rounded-lg bg-purple-800 px-5 font-semibold text-white hover:bg-purple-700 dark:bg-fuchsia-700 dark:hover:bg-fuchsia-600"
        >
          {submitting
            ? "Publishing..."
            : uploading
              ? "Uploading banner..."
              : "Publish tuition"}
        </Button>
      </div>
    </form>
  )
}
