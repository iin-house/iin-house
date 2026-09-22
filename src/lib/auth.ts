import { hash, compare } from "bcryptjs";

export async function hashPassword(password: string) {
  return hash(password, 12);
}

export function isStrongPassword(pw: string): boolean {
  if (pw.length < 10) return false;
  if (!/[A-Z]/.test(pw)) return false;
  if (!/[a-z]/.test(pw)) return false;
  if (!/[0-9]/.test(pw)) return false;
  return true;
}
