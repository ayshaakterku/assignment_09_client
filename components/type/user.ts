export type UserRole = "student" | "tutor" | "admin";
export type UserPlan = "free" | "pro" | "premium";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  role: UserRole;
  phone: string;
  bio: string;
  location: string;
  plan: UserPlan;
}