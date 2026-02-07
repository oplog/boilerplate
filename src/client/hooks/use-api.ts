// Type-safe API hook'u
// TanStack Query ile backend API çağrıları için kullanılır

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

// Genel veri çekme hook'u
export function useApiQuery<T>(key: string[], endpoint: string) {
  return useQuery<T>({
    queryKey: key,
    queryFn: () => apiClient<T>(endpoint),
  });
}

// Genel veri gönderme hook'u (POST, PUT, DELETE)
export function useApiMutation<TData, TBody>(
  endpoint: string,
  options: {
    method?: string;
    invalidateKeys?: string[][];
  } = {}
) {
  const queryClient = useQueryClient();
  const { method = "POST", invalidateKeys = [] } = options;

  return useMutation<TData, Error, TBody>({
    mutationFn: (body) =>
      apiClient<TData>(endpoint, { method, body }),
    onSuccess: () => {
      // İlgili sorguları yenile
      invalidateKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
  });
}
