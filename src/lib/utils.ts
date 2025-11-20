import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const examIdMap: Record<string, number> = {
  JEE: 1,
  NEET: 2,
  BITSAT: 3,
  VITEEE: 4,
};
