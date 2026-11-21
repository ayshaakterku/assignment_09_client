import { BASE_URL } from "../api-access/tutions"
import { TuitionApplication } from "../type/tution"

/** Approval statuses an admin can set from the moderation queue. */
export type ModerateApprovalStatus = "approved" | "rejected"

export const updateTutionApprovalStatus = async (
  id: string,
  approvalStatus: ModerateApprovalStatus
): Promise<void> => {
  const res = await fetch(`${BASE_URL}/tutions/${id}/approvalStatus`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ approvalStatus }),
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



// data updated of every tution by tutor
export type TutionUpdate = Partial<
  Pick<
    TuitionApplication,
    | "title" | "subject" | "classLevel" | "mode" | "location"
    | "monthlyFee" | "daysPerWeek" | "bannerImage" | "description"
  >
>;

export const updateTutionData = async (
  id: string,
  data: TutionUpdate
): Promise<void> => {
  const res = await fetch(`${BASE_URL}/tutions/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Failed to update tuition (${res.status})`);
  }
};

// data delete by tutor
export const deleteTutionData = async (id: string)=>{
const res = await fetch(`${BASE_URL}/tutions/${id}`, { method: "DELETE" });
if (!res.ok) throw new Error(`Failed to delete tuition (${res.status})`);
}