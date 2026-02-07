// API istemcisi - Backend ile iletişim için kullanılır
// Tüm API çağrıları bu dosyadaki fonksiyonlar üzerinden yapılır

const API_BASE = "/api";

type RequestOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
};

// Genel API çağrısı fonksiyonu
export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, headers = {} } = options;

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      (error as { error?: string }).error || `API hatası: ${response.status}`
    );
  }

  return response.json() as Promise<T>;
}
