// Tablo örneği sayfası
// API'den veri çekme, arama ve pagination özelliklerini gösterir

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { TableSkeleton } from "@/components/shared/loading";

type ExampleItem = {
  id: string;
  name: string;
  description?: string;
  status: string;
  createdAt: string;
};

type ApiResponse = {
  items: ExampleItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export function TableExamplePage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 5;

  // API'den veri çek
  const { data, isLoading } = useQuery<ApiResponse>({
    queryKey: ["examples", page, search],
    queryFn: () =>
      fetch(
        `/api/examples?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
      ).then((r) => r.json()),
  });

  return (
    <div>
      <PageHeader
        title="Tablo Örneği"
        description="API'den veri çekme, arama ve pagination"
      />

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Kayıtlar</CardTitle>

            {/* Arama kutusu */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Ara..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1); // Arama yapınca ilk sayfaya dön
                }}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>İsim</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Açıklama
                    </TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Oluşturulma
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.items.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="py-8 text-center text-muted-foreground"
                      >
                        Kayıt bulunamadı
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.name}
                        </TableCell>
                        <TableCell className="hidden text-muted-foreground sm:table-cell">
                          {item.description || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              item.status === "active"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {item.status === "active" ? "Aktif" : "Pasif"}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden text-muted-foreground md:table-cell">
                          {new Date(item.createdAt).toLocaleDateString("tr-TR")}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {data && data.totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Toplam {data.total} kayıt ({data.page}/{data.totalPages}{" "}
                    sayfa)
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      Önceki
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= (data?.totalPages ?? 1)}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Sonraki
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
