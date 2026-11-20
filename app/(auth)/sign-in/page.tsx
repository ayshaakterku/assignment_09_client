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
import { authClient } from "@/lib/auth-client"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "react-toastify"


// Explicit colors so the form stays readable on the white card
// even if your shadcn theme tokens are light/dark-mode values.
const labelClass = "text-xs font-semibold text-foreground";
const inputClass =
  "h-10 rounded-md border border-input bg-background text-sm text-foreground shadow-none placeholder:text-muted-foreground focus-visible:border-fuchsia-600 focus-visible:ring-2 focus-visible:ring-fuchsia-500/20 dark:bg-input/30";

function SignInPage() {
  const router = useRouter();

  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);

  // Email Login
  const handleEmailLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const user = Object.fromEntries(formData.entries()) as {
      email: string,
      password: string
    };

    setLoginLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        ...user
      });

      if (error) {
        toast.warning(error.message || "Invalid email or password!");
        return;
      }

      if (data) {
        toast.success("Login successful! Welcome back.");

        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        toast.warning("Login failed. Please check your credentials.");
      }

    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  // Google Login
  const handleSignWithGoogle = async () => {
    setGoogleLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        toast.warning(error.message || "Google login failed.");
        setGoogleLoading(false);
      }

      // On successful Google login, browser redirects.

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
          Login
        </span>
        <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
          <svg className="h-3.5 w-3.5 text-fuchsia-700 dark:text-fuchsia-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1.2 14.6l-4-4 1.4-1.4 2.6 2.6 5-5 1.4 1.4-6.4 6.4z" />
          </svg>
          Secure login
        </span>
      </div>

      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground">
        Welcome back
      </h1>
      <p className="mt-1 text-xs text-muted-foreground">
        Login with your Google account or email.
      </p>

      <form onSubmit={handleEmailLogin} className="mt-6">
        <FieldGroup>

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

              {googleLoading ? "Connecting..." : "Login with Google"}
            </Button>
          </Field>

          <FieldSeparator className="text-muted-foreground *:data-[slot=field-separator-content]:bg-card *:data-[slot=field-separator-content]:text-muted-foreground">
            Or continue with
          </FieldSeparator>

          <Field>
            <FieldLabel className={labelClass} htmlFor="email">
              Email
            </FieldLabel>

            <Input
              className={inputClass}
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </Field>

          <Field>
            <div className="flex items-center justify-between gap-3">
              <FieldLabel className={labelClass} htmlFor="password">
                Password
              </FieldLabel>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-fuchsia-700 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Input
              className={inputClass}
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              required
            />
          </Field>

          <Field>
            <Button
              type="submit"
              disabled={loginLoading}
              className="h-11 w-full gap-2 rounded-xl border-0 bg-fuchsia-800 font-bold text-white shadow-lg shadow-fuchsia-900/25 hover:bg-fuchsia-700"
            >
              {loginLoading ? "Logging in..." : "Log In"}
              {!loginLoading && (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6l6 6-6 6" />
                </svg>
              )}
            </Button>

            <FieldDescription className="text-center">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="font-bold text-fuchsia-700 hover:underline dark:text-fuchsia-300">
                Register
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

export default SignInPage;