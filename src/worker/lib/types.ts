// Paylaşılan TypeScript tipleri
// Frontend ve backend arasında kullanılacak ortak tipler burada tanımlanır

export type ApiResponse<T> = {
  data?: T;
  error?: string;
  message?: string;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ExampleItem = {
  id: string;
  name: string;
  description?: string;
  status: "active" | "inactive";
  createdAt: string;
};
