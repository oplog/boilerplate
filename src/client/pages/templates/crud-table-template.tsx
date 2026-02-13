// CRUD Tablo Template
// Arama, filtreleme, ekleme, duzenleme, silme ve pagination iceren tam ornek
// Bu dosyayi kopyalayip kendi ihtiyacina gore duzenlayebilirsin

import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ─── Veri Tipi ──────────────────────────────────────────────
type Employee = {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive" | "pending";
  date: string;
};

// ─── Ornek Veri (Mock Data) ─────────────────────────────────
const initialData: Employee[] = [
  { id: "EMP-001", name: "Ahmet Yilmaz", email: "ahmet.yilmaz@oplog.com", status: "active", date: "2025-01-15" },
  { id: "EMP-002", name: "Elif Kaya", email: "elif.kaya@oplog.com", status: "active", date: "2025-02-03" },
  { id: "EMP-003", name: "Mehmet Demir", email: "mehmet.demir@oplog.com", status: "inactive", date: "2024-11-20" },
  { id: "EMP-004", name: "Zeynep Celik", email: "zeynep.celik@oplog.com", status: "pending", date: "2025-03-10" },
  { id: "EMP-005", name: "Mustafa Ozturk", email: "mustafa.ozturk@oplog.com", status: "active", date: "2025-01-28" },
  { id: "EMP-006", name: "Fatma Arslan", email: "fatma.arslan@oplog.com", status: "active", date: "2024-12-05" },
  { id: "EMP-007", name: "Emre Sahin", email: "emre.sahin@oplog.com", status: "inactive", date: "2024-09-14" },
  { id: "EMP-008", name: "Ayse Yildiz", email: "ayse.yildiz@oplog.com", status: "pending", date: "2025-04-01" },
  { id: "EMP-009", name: "Burak Korkmaz", email: "burak.korkmaz@oplog.com", status: "active", date: "2025-02-18" },
  { id: "EMP-010", name: "Seda Aydin", email: "seda.aydin@oplog.com", status: "active", date: "2025-03-22" },
  { id: "EMP-011", name: "Cem Erdogan", email: "cem.erdogan@oplog.com", status: "inactive", date: "2024-10-30" },
  { id: "EMP-012", name: "Deniz Aksoy", email: "deniz.aksoy@oplog.com", status: "pending", date: "2025-04-15" },
];

// ─── Yardimci Fonksiyonlar ──────────────────────────────────
const statusLabels: Record<Employee["status"], string> = {
  active: "Aktif",
  inactive: "Pasif",
  pending: "Beklemede",
};

const statusVariants: Record<Employee["status"], "default" | "secondary" | "outline"> = {
  active: "default",
  inactive: "secondary",
  pending: "outline",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// ─── Sayfa Bileseni ─────────────────────────────────────────
const ITEMS_PER_PAGE = 5;

export function CrudTableTemplatePage() {
  // Veri state'leri
  const [items, setItems] = useState<Employee[]>(initialData);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Dialog state'leri
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Employee | null>(null);

  // Form state'leri
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formStatus, setFormStatus] = useState<Employee["status"]>("active");

  // ─── Filtreleme ve Pagination ─────────────────────────────
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        search === "" ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.email.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [items, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));

  // Sayfa sinirlarini kontrol et (filtreleme sonrasi sayfa sayisi duserse)
  const safePage = Math.min(currentPage, totalPages);
  const paginatedItems = filteredItems.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  // ─── Form Islemleri ───────────────────────────────────────
  function openAddDialog() {
    setSelectedItem(null);
    setFormName("");
    setFormEmail("");
    setFormStatus("active");
    setIsFormOpen(true);
  }

  function openEditDialog(item: Employee) {
    setSelectedItem(item);
    setFormName(item.name);
    setFormEmail(item.email);
    setFormStatus(item.status);
    setIsFormOpen(true);
  }

  function openDeleteDialog(item: Employee) {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  }

  function handleSave() {
    // Basit validasyon
    if (!formName.trim()) {
      toast.error("Isim alani bos birakilamaz.");
      return;
    }
    if (!formEmail.trim() || !formEmail.includes("@")) {
      toast.error("Gecerli bir email adresi giriniz.");
      return;
    }

    if (selectedItem) {
      // Duzenleme
      setItems((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id
            ? { ...item, name: formName.trim(), email: formEmail.trim(), status: formStatus }
            : item
        )
      );
      toast.success(`"${formName.trim()}" basariyla guncellendi.`);
    } else {
      // Yeni kayit
      const newId = `EMP-${String(items.length + 1).padStart(3, "0")}`;
      const newItem: Employee = {
        id: newId,
        name: formName.trim(),
        email: formEmail.trim(),
        status: formStatus,
        date: new Date().toISOString().split("T")[0],
      };
      setItems((prev) => [newItem, ...prev]);
      toast.success(`"${formName.trim()}" basariyla eklendi.`);
    }

    setIsFormOpen(false);
  }

  function handleDelete() {
    if (!selectedItem) return;

    setItems((prev) => prev.filter((item) => item.id !== selectedItem.id));
    toast.success(`"${selectedItem.name}" basariyla silindi.`);
    setIsDeleteOpen(false);
    setSelectedItem(null);
  }

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setCurrentPage(1);
  }

  const hasActiveFilters = search !== "" || statusFilter !== "all";

  // ─── Render ───────────────────────────────────────────────
  return (
    <div>
      {/* Sayfa Basligi */}
      <PageHeader
        title="Calisan Yonetimi"
        description="Calisanlari goruntuleyebilir, ekleyebilir, duzenleyebilir ve silebilirsiniz."
        actions={
          <Button onClick={openAddDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Ekle
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Calisan Listesi</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Arama ve Filtre Araclari */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              {/* Arama */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Isim, email veya ID ile ara..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9"
                />
              </div>

              {/* Durum Filtresi */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={statusFilter}
                  onValueChange={(value) => {
                    setStatusFilter(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Durum filtrele" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tum Durumlar</SelectItem>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Pasif</SelectItem>
                    <SelectItem value="pending">Beklemede</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filtreleri Temizle */}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-9 px-2 text-muted-foreground"
                >
                  <X className="mr-1 h-4 w-4" />
                  Temizle
                </Button>
              )}
            </div>
          </div>

          <Separator className="mb-4" />

          {/* Tablo */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Isim</TableHead>
                  <TableHead className="hidden sm:table-cell">Email</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="hidden md:table-cell">Tarih</TableHead>
                  <TableHead className="w-[60px] text-right">Islem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedItems.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-12 text-center text-muted-foreground"
                    >
                      {hasActiveFilters
                        ? "Arama kriterlerine uygun kayit bulunamadi."
                        : "Henuz kayit bulunmuyor."}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {item.id}
                      </TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="hidden text-muted-foreground sm:table-cell">
                        {item.email}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariants[item.status]}>
                          {statusLabels[item.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground md:table-cell">
                        {formatDate(item.date)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Islemler</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(item)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Duzenle
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => openDeleteDialog(item)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Sil
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              Toplam {filteredItems.length} kayit
              {filteredItems.length !== items.length && (
                <span> (filtrelenmis, toplam {items.length})</span>
              )}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Onceki
              </Button>
              <span className="text-sm text-muted-foreground">
                {safePage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={safePage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Sonraki
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─── Ekle / Duzenle Dialog ─────────────────────────── */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? "Calisan Duzenle" : "Yeni Calisan Ekle"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Isim */}
            <div className="space-y-2">
              <Label htmlFor="form-name">Isim</Label>
              <Input
                id="form-name"
                placeholder="Adi ve soyadi giriniz"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="form-email">Email</Label>
              <Input
                id="form-email"
                type="email"
                placeholder="ornek@oplog.com"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
              />
            </div>

            {/* Durum */}
            <div className="space-y-2">
              <Label>Durum</Label>
              <Select
                value={formStatus}
                onValueChange={(value) => setFormStatus(value as Employee["status"])}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Pasif</SelectItem>
                  <SelectItem value="pending">Beklemede</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
              Iptal
            </Button>
            <Button onClick={handleSave}>
              {selectedItem ? "Guncelle" : "Kaydet"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Silme Onay Dialog ─────────────────────────────── */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kaydi silmek istediginize emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{selectedItem?.name}</strong> ({selectedItem?.id}) kaydini
              silmek uzeresiniz. Bu islem geri alinamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Vazgec</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
