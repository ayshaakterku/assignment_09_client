import { IUser } from "../type/user"
import { BASE_URL } from "./tutions"

export const getUser = async (query = ""): Promise<IUser[]> => {
  const res = await fetch(`${BASE_URL}/users?${query}`, { cache: "no-store" })

  if (!res.ok) {
    throw new Error(`Failed to load user data (${res.status})`)
  }
  return res.json()
}

// for premium user get pass
export const getUserPremiumById = async(userId: string)=>{
  const response = await fetch(`${BASE_URL}/users/${userId}/premium`);
  return response.json();
}