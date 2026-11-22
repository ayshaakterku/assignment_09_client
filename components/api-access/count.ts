import { BASE_URL } from "./tutions";

export const getStudentApplicationCount = async (
  studentEmail: string
): Promise<number> => {
  const res = await fetch(
    `${BASE_URL}/applications/count?studentEmail=${encodeURIComponent(studentEmail)}`
  );
  if (!res.ok) throw new Error(`Failed to fetch application count (${res.status})`);
  const data = await res.json();
  return data.count;
};

export const getTutorTutionCount = async (
  tutorEmail: string
): Promise<number> => {
  const res = await fetch(
    `${BASE_URL}/tution/count?tutorEmail=${encodeURIComponent(tutorEmail)}`
  );
  if (!res.ok) throw new Error(`Failed to fetch tuition count (${res.status})`);
  const data = await res.json();
  return data.count;
};