
"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const invalidToken = searchParams.get("error");

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);

    const newPassword = formData.get("password") as string;
    const confirmPassword = formData.get(
      "confirmPassword"
    ) as string;

    if (!token) {
      setErrorMessage("Invalid or expired reset link.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.resetPassword({
        newPassword,
        token,
      });

      if (error) {
        setErrorMessage(error.message ?? "Something went wrong with pass reset. Try again.");
        return;
      }

      alert("Password reset successfully!");

      router.push("/sign-in");
    } catch (error) {
      console.error(error);
      setErrorMessage("Something went wrong with pass reset. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-md p-8 border rounded-xl shadow-lg"
      >
        <h1 className="text-2xl font-bold text-center">
          Reset Password
        </h1>

        {invalidToken && (
          <p className="text-red-500 text-sm">
            Your reset link is invalid or expired.
            Please request a new one.
          </p>
        )}

        <input
          name="password"
          type="password"
          placeholder="New Password"
          minLength={8}
          required
          className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm New Password"
          minLength={8}
          required
          className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        />

        {errorMessage && (
          <p className="text-red-500 text-sm">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !token || !!invalidToken}
          className="w-full bg-red-400 text-white py-3 rounded-lg hover:bg-red-500 disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
