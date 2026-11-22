import { StudentTuitionApplication } from "../type/application"
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
};



/** Student applications for the tuitions owned by one tutor. */
export const getCollectionByTutor = async (
  query = ""
): Promise<StudentTuitionApplication[]> => {
  const res = await fetch(`${BASE_URL}/applications?${query}`, {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error(`Failed to load applications data (${res.status})`)
  }
  return res.json()
}

/** Applications submitted by one student. */
export const getCollectionBytutor = async (
  query = ""
): Promise<StudentTuitionApplication[]> => {
  const res = await fetch(`${BASE_URL}/applications?${query}`, {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error(`Failed to load applications data (${res.status})`)
  }
  return res.json()
}
export const getCollectionByStudent = async (
  query = ""
): Promise<StudentTuitionApplication[]> => {
  const res = await fetch(`${BASE_URL}/applications?${query}`, {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error(`Failed to load applications data (${res.status})`)
  }
  return res.json()
}

