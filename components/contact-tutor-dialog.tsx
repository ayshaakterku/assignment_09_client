"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2, Mail, Send } from "lucide-react"
import { toast } from "react-toastify"

import { BASE_URL } from "@/components/api-access/tutions"
import type { TuitionApplication } from "@/components/type/tution"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { authClient } from "@/lib/auth-client"
import { getStudentApplicationCount } from "./api-access/count"
import { redirect, useRouter } from "next/navigation"

const buttonClass =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-fuchsia-700 to-purple-800 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-110"

const scheduleOptions = [
  "Morning (8am – 12pm)",
  "Afternoon (12pm – 4pm)",
  "Evening (4pm – 9pm)",
  "Weekend",
  "Flexible timing",
] as const

export default function ContactTutorDialog({
  tuition,
}: {
  tuition: TuitionApplication
}) {
  const { data: session, isPending } = authClient.useSession()
  const student = session?.user

  const [open, setOpen] = useState(false)
  const [schedule, setSchedule] = useState("")
  // `null` means "use the phone saved on the student's account".
  const [phoneInput, setPhoneInput] = useState<string | null>(null)
  const [note, setNote] = useState("")
  const [sending, setSending] = useState(false)

  const phone = phoneInput ?? student?.phone ?? ""

  const isOwnTuition = Boolean(
    student?.email && student.email === tuition.tutorEmail
  )

  const handleSubmitStudentRequest = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    if (!student) {
      toast.error("Please sign in to contact the tutor.")
      return
    }

    const preferredSchedule = schedule.trim()
    const studentPhone = phone.trim()
    const digits = studentPhone.replace(/\D/g, "")

    if (!preferredSchedule) {
      toast.error("Please select your preferred schedule.")
      return
    }

    if (digits.length < 10 || digits.length > 15) {
      toast.error("Please enter a valid mobile number.")
      return
    }

    const data = {
      tuitionId: tuition.tutionId ?? tuition._id,
      tuitionTitle: tuition.title,
      subject: tuition.subject,
      monthlyFee: tuition.monthlyFee,
      tutorEmail: tuition.tutorEmail,
      studentName: student.name ?? "",
      studentEmail: student.email ?? "",
      studentPhone,
      preferredSchedule,
      studentNote: note.trim(),
      status: "pending" as const,
      appliedAt: new Date().toISOString(),
    }

    setSending(true)

    // directed to payment page if number of post is greater than 2
    const studentApplicationCount = await getStudentApplicationCount(
      student.email
    )
    if (studentApplicationCount >= 2) {
      toast.error("You have already reached the limit")
      redirect("/payment")
      return
    } else {
      try {
        const res = await fetch(`${BASE_URL}/applications`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })

        if (!res.ok) {
          let message = `Could not send your request (${res.status})`

          try {
            const body = (await res.json()) as { message?: string }
            if (body?.message) message = body.message
          } catch {
            // Response had no JSON body; keep the generic message.
          }

          throw new Error(message)
        }

        toast.success("Your request has been sent to the tutor.")
        setOpen(false)
        setSchedule("")
        setPhoneInput(null)
        setNote("")
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Could not send your request. Please try again."
        )
      } finally {
        setSending(false)
      }
    }
  }

  if (!tuition.isActive) {
    return (
      <Button
        type="button"
        disabled
        className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-bold"
      >
        Tuition closed
      </Button>
    )
  }

  if (isOwnTuition) {
    return (
      <Button
        type="button"
        disabled
        className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-bold"
      >
        This is your tuition
      </Button>
    )
  }

  // Not signed in yet: send them to the login page first.
  if (!isPending && !student) {
    return (
      <Link href="/sign-in" className={buttonClass}>
        <Mail className="size-4" />
        Sign in to Contact
      </Link>
    )
  }

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        disabled={isPending}
        className={buttonClass}
      >
        <Mail className="size-4" />
        Contact Tutor
      </Button>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!sending) setOpen(next)
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
          <form onSubmit={handleSubmitStudentRequest} className="space-y-4">
            <DialogHeader>
              <DialogTitle>
                Contact {tuition.tutorName || "the tutor"}
              </DialogTitle>
              <DialogDescription>
                Send your schedule, mobile number and a short note for &ldquo;
                {tuition.title}&rdquo;. The tutor will review your request.
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-lg bg-muted/60 px-3 py-2.5">
              <p className="text-xs font-bold text-foreground">
                {student?.name || "Student"}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {student?.email}
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="request-schedule">Preferred schedule</Label>
              <div className="relative">
                <select
                  id="request-schedule"
                  value={schedule}
                  onChange={(event) => setSchedule(event.target.value)}
                  required
                  className="h-10 w-full appearance-none rounded-md border border-input bg-background px-2.5 pr-9 text-sm text-foreground shadow-none transition outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                >
                  <option value="" disabled>
                    Select a preferred schedule
                  </option>
                  {scheduleOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
                >
                  <path
                    d="M6 8l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="request-phone">Mobile number</Label>
              <Input
                id="request-phone"
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(event) => setPhoneInput(event.target.value)}
                required
                maxLength={20}
                placeholder="01XXXXXXXXX"
                className="h-10"
              />
              <p className="text-[11px] text-muted-foreground">
                The tutor will use this number to reach you.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="request-note">Note for the tutor</Label>
              <Textarea
                id="request-note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                maxLength={500}
                rows={3}
                placeholder="Share your goals, current level, or anything the tutor should know."
              />
              <p className="text-[11px] text-muted-foreground">
                Optional · {note.length}/500
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={sending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={sending}
                className="bg-purple-800 text-white hover:bg-purple-700 dark:bg-fuchsia-700 dark:hover:bg-fuchsia-600"
              >
                {sending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="size-4" />
                    Send request
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
