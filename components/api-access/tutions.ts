import { getTokenFromServer } from "@/lib/getTokenFromServer"
import { StudentTuitionApplication } from "../type/application"
import { TuitionApplication } from "../type/tution"
import { getTokenFromClient } from "@/lib/getTokenFromClient"

export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const getTutions = async (query = ""): Promise<TuitionApplication[]> => {
  const res = await fetch(`${BASE_URL}/tutions?${query}`, { cache: "no-store" })

  if (!res.ok) {
    throw new Error(`Failed to load tutions data (${res.status})`)
  }
  return res.json()
}

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

// browse tutions

// export const getBrowseTutions = async (): Promise<TuitionApplication[]> => {
//   const res = await fetch(`${BASE_URL}/browse-tutions`, { cache: "no-store" })

//   if (!res.ok) {
//     throw new Error(`Failed to load tutions data (${res.status})`)
//   }
//   return res.json()
// };
// adjust the path

// browse tutions
export interface BrowseTutionsParams {
  page?: number
  limit?: number
  subject?: string
  classLevel?: string
}

export interface PaginatedTutions {
  data: TuitionApplication[]
  total: number
  page: number
  limit: number
  totalPages: number
  /** Filter options (distinct values across the public feed). */
  subjects: string[]
  classLevels: string[]
}

export const getBrowseTutions = async (
  params: BrowseTutionsParams = {}
): Promise<PaginatedTutions> => {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") query.set(key, String(value))
  }

  const res = await fetch(`${BASE_URL}/browse-tutions?${query}`, {
    cache: "no-store",
  })
  if (!res.ok) throw new Error(`Failed to fetch tuitions (${res.status})`)
  return res.json()
}

/** Single tuition by Mongo id or tutionId. */
export const getTutionById = async (
  id: string
): Promise<TuitionApplication | null> => {
  const res = await fetch(`${BASE_URL}/tutions/${encodeURIComponent(id)}`, {
    cache: "no-store",
  })

  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Failed to fetch tuition (${res.status})`)

  return res.json()
}

// usage
