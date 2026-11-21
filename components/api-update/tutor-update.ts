import { BASE_URL } from "../api-access/tutions"


export const updateTutorActiveStatus = async (
  id: string,
  isActive: boolean
): Promise<void> => {
  const res = await fetch(`${BASE_URL}/tutions/${id}/isActive`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isActive }),
  })

  if (!res.ok) {
    let message = `Failed to update tuition status (${res.status})`

    try {
      const body = (await res.json()) as { message?: string }
      if (body?.message) message = body.message
    } catch {
      // Response had no JSON body; keep the generic message.
    }

    throw new Error(message)
  }
}
