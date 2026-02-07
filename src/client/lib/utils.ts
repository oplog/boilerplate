// shadcn/ui yardımcı fonksiyonu
// className'leri birleştirmek için kullanılır

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
