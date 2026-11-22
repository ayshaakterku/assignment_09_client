export type TuitionMode = "Online" | "Offline";

/**
 * The API stores `"approved"`, while some older records/clients use
 * `"accepted"`. Both mean the same thing, so the admin UI normalizes them.
 */
export type ApprovalStatus = "pending" | "approved" | "accepted" | "rejected";
export interface TuitionApplication {
  // Tuition Information
  _id: string;
  tutionId?: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: TuitionMode;
  location: string;
  monthlyFee: number;
  daysPerWeek: number;
  bannerImage: string;
  description: string;
  tutorName: string;
  tutorEmail: string;
  approvalStatus: ApprovalStatus;
  isActive: boolean;
  createdAt: string;
}

/** @deprecated Use `TuitionApplication` instead. Kept for existing imports. */
export type TutoionProfile = TuitionApplication;

/**
 * Payload used when a tutor creates a new tuition. The server fills in
 * `approvalStatus: "pending"` and `isActive: true` on insert, but the fields
 * are kept here so the form payload matches the stored document shape.
 */
export interface PostTuitionApplicationForm {
  tutionId?: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: TuitionMode;
  location: string;
  monthlyFee: number;
  daysPerWeek: number;
  bannerImage: string;
  description: string;
  tutorName: string;
  tutorEmail: string;
  approvalStatus: "pending";
  isActive: true;
}