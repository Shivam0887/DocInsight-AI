import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  if (process.env.VERCEL_URL) return `https://doc-insight-ai.vercel.app${path}`;
  else if (typeof window === undefined) return `http://localhost:3000${path}`;
  return path;
}
