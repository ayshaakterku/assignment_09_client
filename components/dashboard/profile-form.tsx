"use client";

import { useState } from "react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { DashboardUser } from "./types";
import { PageHeading, Panel } from "./ui";

export default function ProfileForm({ user }: { user: DashboardUser }) {
  const [saving, setSaving] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    // Demo only: wire this to better-auth `updateUser` when the profile
    // endpoints are ready.
    window.setTimeout(() => {
      setSaving(false);
      toast.success("Profile updated successfully.");
    }, 600);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeading
        title="Update Profile"
        subtitle="Keep your personal details up to date so tutors and students can reach you."
      />

      <Panel className="mt-6">
        <form onSubmit={handleSubmit} className="p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="profile-name">Full name</Label>
              <Input
                id="profile-name"
                name="name"
                defaultValue={user.name ?? ""}
                className="h-10"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="profile-email">Email</Label>
              <Input
                id="profile-email"
                name="email"
                type="email"
                defaultValue={user.email ?? ""}
                className="h-10"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="profile-phone">Phone</Label>
              <Input
                id="profile-phone"
                name="phone"
                type="tel"
                placeholder="+880 1XXX-XXXXXX"
                className="h-10"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="profile-location">Location</Label>
              <Input
                id="profile-location"
                name="location"
                placeholder="Dhanmondi, Dhaka"
                className="h-10"
              />
            </div>
          </div>

          <div className="mt-4 space-y-1.5">
            <Label htmlFor="profile-bio">Short bio</Label>
            <Textarea
              id="profile-bio"
              name="bio"
              rows={4}
              placeholder="Tell us a little about yourself, your subjects or what you are looking for."
            />
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              disabled={saving}
              className="h-10 rounded-lg bg-purple-800 px-5 font-semibold text-white hover:bg-purple-700 dark:bg-fuchsia-700 dark:hover:bg-fuchsia-600"
            >
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </Panel>
    </div>
  );
}
