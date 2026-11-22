import { BASE_URL } from "./tutions"

export interface ISavedTuitionApplication {
  _id: string;
  tuitionId: string;
  tuitionTitle: string;
  subject: string;
  monthlyFee: number;
  tutorEmail: string;
  studentName: string;
  studentEmail: string;
  appliedAt: string; // ISO date string
}

/** Saved tuitions for one student. */
export const getSavedItemsByEmail = async (
  query = ""
): Promise<ISavedTuitionApplication[]> => {
  const res = await fetch(`${BASE_URL}/saved?${query}`, { cache: "no-store" })

  if (!res.ok) {
    throw new Error(`Failed to load saved tuitions (${res.status})`)
  }
  return res.json()
}

export const deleteSavedTution = async (
  id: string,
  studentEmail: string
): Promise<void> => {
  const res = await fetch(
    `${BASE_URL}/saved/${id}?studentEmail=${encodeURIComponent(studentEmail)}`,
    { method: "DELETE" }
  );

  if (!res.ok) {
    let message = `Failed to delete saved tuition (${res.status})`;

    try {
      const body = (await res.json()) as { message?: string };
      if (body?.message) message = body.message;
    } catch {
      // Response had no JSON body; keep the generic message.
    }

    throw new Error(message);
  }
};
