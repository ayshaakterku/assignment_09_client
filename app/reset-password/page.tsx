import { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}









// // app/reset-password/ResetPasswordForm.tsx
// "use client";

// import { useSearchParams, useRouter } from "next/navigation";
// import { authClient } from "@/lib/auth-client";

// export default function ResetPasswordForm() {
//   const token = useSearchParams().get("token");
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const newPassword = new FormData(e.currentTarget).get("password") as string;
//     if (!token) return alert("Invalid or missing token");

//     const { error } = await authClient.resetPassword({ newPassword, token });
//     if (error) return alert(error.message);

//     router.push("/login");
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input name="password" type="password" minLength={6} required />
//       <button type="submit">Reset password</button>
//     </form>
//   );
// }