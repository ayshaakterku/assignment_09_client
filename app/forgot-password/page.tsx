
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setErrorMessage("");

    const email = new FormData(e.currentTarget).get(
      "email"
    ) as string;

    try {
      const { error } =
        await authClient.requestPasswordReset({
          email,
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
        });

      if (error) {
        setErrorMessage(error.message ?? "Something went wrong with forgot pass.");
      } else {
        setMessage(
          "If that email exists, a reset link has been sent."
        );
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Something went wrong.");
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
          Forgot Password?
        </h1>

        <p className="text-sm text-gray-500 text-center">
          Enter your email to receive a password reset link.
        </p>

        <input
          name="email"
          type="email"
          placeholder="Enter your email"
          required
          className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        />

        {message && (
          <p className="text-green-600 text-sm">{message}</p>
        )}

        {errorMessage && (
          <p className="text-red-500 text-sm">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-400 text-white py-3 rounded-lg hover:bg-red-500 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <Link
          href="/sign-in"
          className="text-center text-blue-500 hover:underline"
        >
          Back to Login
        </Link>
      </form>
    </div>
  );
}


// "use client";

// import { authClient } from "@/lib/auth-client";

// export default function ForgotPassword() {
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const email = new FormData(e.currentTarget).get("email") as string;

//     const { error } = await authClient.requestPasswordReset({
//       email,
//       redirectTo: `${process.env.NEXT_PUBLIC_API_URL}/reset-password`,
//     });

//     if (error) console.error(error.message);
//     else alert("If that email exists, a reset link has been sent.");
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <form
//         onSubmit={handleSubmit}
//         className="flex flex-col gap-4 w-full max-w-md p-8 border rounded-xl shadow-lg"
//       >
//         <input
//           name="email"
//           type="email"
//           placeholder="Enter your email"
//           required
//           className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
//         />

//         <button
//           type="submit"
//           className="w-full bg-red-400 text-white py-3 rounded-lg hover:bg-red-500 transition"
//         >
//           Send reset link
//         </button>
//       </form>
//     </div>
//   );
// }
