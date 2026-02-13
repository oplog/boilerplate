// Kullanici bilgisi hook'u
// Cloudflare Zero Trust ile authenticate olan kullanicinin bilgisini /api/me'den ceker

import { useApiQuery } from "@/hooks/use-api";

type User = {
  email: string;
  name: string;
};

export function useUser() {
  const { data, isLoading, error } = useApiQuery<User>(["user"], "/me");

  return {
    user: data ?? null,
    isLoading,
    error,
  };
}
