import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import Navbar from "@/components/NavBar";
import { Bounce, ToastContainer } from "react-toastify";

const geist = Geist({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", geist.variable)}
    >
      <Navbar/>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <ToastContainer
            position="top-right"
            autoClose={1000}
            hideProgressBar
            closeOnClick
            pauseOnHover
            draggable
            theme="light"
            transition={Bounce}
          />
      </body>
    </html>
  )
}
