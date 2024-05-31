import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const absoluteUrl = () => {
  if (process.env.VERCEL_URL) return "https://doc-insight-ai.vercel.app";
  return "http://localhost:3000";
};
