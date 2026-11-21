import { TuitionApplication } from "../type/tution"

export const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:8000"

export const getTutions = async (query = ""): Promise<TuitionApplication[]> => {
  const res = await fetch(`${BASE_URL}/tutions?${query}`, { cache: "no-store" })

  if (!res.ok) {
    throw new Error(`Failed to load tutions data (${res.status})`)
  }
  return res.json()
}
