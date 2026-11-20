"use client";

import { Bounce, ToastContainer } from "react-toastify";
import { useTheme } from "next-themes";

export default function ThemedToastContainer() {
  const { resolvedTheme } = useTheme();

  return (
    <ToastContainer
      position="top-right"
      autoClose={1000}
      hideProgressBar
      closeOnClick
      pauseOnHover
      draggable
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      transition={Bounce}
    />
  );
}
