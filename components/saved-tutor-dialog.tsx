"use client";

import { useState } from "react";
import Link from "next/link";
import { Bookmark, Loader2, Mail } from "lucide-react";
import { toast } from "react-toastify";

import { BASE_URL } from "@/components/api-access/tutions";
import type { TuitionApplication } from "@/components/type/tution";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";

const buttonClass =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-purple-200 bg-white px-6 py-3 text-sm font-bold text-purple-700 shadow-sm transition hover:bg-purple-50 dark:border-purple-500/40 dark:bg-transparent dark:text-purple-300 dark:hover:bg-purple-500/10";

export default function SavedTutionDialog({
  tuition,
}: {
  tuition: TuitionApplication;
}) {
  const { data: session, isPending } = authClient.useSession();
  const student = session?.user;

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const isOwnTuition = Boolean(
    student?.email && student.email === tuition.tutorEmail
  );

  const handleSubmitStudentRequest = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!student) {
      toast.error("Please sign in to save this tuition.");
      return;
    }

    const data = {
      tuitionId: tuition.tutionId ?? tuition._id,
      tuitionTitle: tuition.title,
      subject: tuition.subject,
      monthlyFee: tuition.monthlyFee,
      tutorEmail: tuition.tutorEmail,
      studentName: student.name ?? "",
      studentEmail: student.email ?? "",
      appliedAt: new Date().toISOString(),
    };

    setSaving(true);

    try {
      const res = await fetch(`${BASE_URL}/saved`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        let message = `Could not save this tuition (${res.status})`;

        try {
          const body = (await res.json()) as { message?: string };
          if (body?.message) message = body.message;
        } catch {
          // Response had no JSON body; keep the generic message.
        }

        throw new Error(message);
      }

      toast.success("Tuition saved successfully.");
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not save this tuition. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (!tuition.isActive) {
    return (
      <Button
        type="button"
        disabled
        className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-bold"
      >
        Tuition closed
      </Button>
    );
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
    );
  }

  // Not signed in yet: send them to the login page first.
  if (!isPending && !student) {
    return (
      <Link href="/sign-in" className={buttonClass}>
        <Mail className="size-4" />
        Sign in to Save
      </Link>
    );
  }

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        disabled={isPending}
        className={buttonClass}
      >
        <Bookmark className="size-4" />
        Save Tuition
      </Button>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!saving) setOpen(next);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSubmitStudentRequest} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Save this tuition?</DialogTitle>
              <DialogDescription>
                &ldquo;{tuition.title}&rdquo; will be added to your saved
                tuitions so you can find it later.
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-purple-800 text-white hover:bg-purple-700 dark:bg-fuchsia-700 dark:hover:bg-fuchsia-600"
              >
                {saving ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Bookmark className="size-4" />
                    Save tuition
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
