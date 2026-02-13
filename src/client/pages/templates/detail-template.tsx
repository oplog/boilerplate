// Detay/Goruntuleme Sablon Sayfasi
// Tek bir kaydin tum bilgilerini gosteren referans sablon
// Sekmeli yapi: Genel Bilgiler, Aktivite Gecmisi, Iliskili Kayitlar

import {
  ArrowLeft,
  Pencil,
  Trash2,
  Clock,
  User,
  Mail,
  Phone,
  Building,
  Calendar,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ---------------------------------------------------------------------------
// Mock Veri
// ---------------------------------------------------------------------------

const employee = {
  id: "EMP-2024-0042",
  firstName: "Ahmet",
  lastName: "Yilmaz",
  email: "ahmet.yilmaz@oplog.com",
  phone: "+90 532 456 78 90",
  department: "Operasyon",
  position: "Depo Yoneticisi",
  startDate: "2021-03-15",
  status: "active" as const,
  address: "Kartal Sanayi Mahallesi, Lojistik Cad. No:12/A",
  city: "Istanbul",
  postalCode: "34870",
  emergencyContact: "Fatma Yilmaz - +90 533 111 22 33",
};

const activityItems = [
  {
    id: 1,
    type: "info" as const,
    title: "Yillik izin talebi onaylandi",
    description:
      "15-19 Temmuz 2024 tarihli 5 gunluk yillik izin talebi yonetici tarafindan onaylandi.",
    timestamp: "2 saat once",
  },
  {
    id: 2,
    type: "warning" as const,
    title: "Departman degisikligi yapildi",
    description:
      "Bilgi Teknolojileri departmanindan Operasyon departmanina transfer edildi.",
    timestamp: "2 gun once",
  },
  {
    id: 3,
    type: "success" as const,
    title: "Performans degerlendirmesi tamamlandi",
    description:
      "2024 Q2 performans degerlendirmesi basariyla tamamlandi. Genel puan: 4.2/5",
    timestamp: "1 hafta once",
  },
  {
    id: 4,
    type: "default" as const,
    title: "Egitim sertifikasi yuklendi",
    description:
      "Is Guvenligi ve Isci Sagligi egitim sertifikasi sisteme yuklendi.",
    timestamp: "2 hafta once",
  },
  {
    id: 5,
    type: "info" as const,
    title: "Pozisyon guncellendi",
    description:
      "Depo Operasyon Sorumlusu pozisyonundan Depo Yoneticisi pozisyonuna terfi edildi.",
    timestamp: "1 ay once",
  },
  {
    id: 6,
    type: "default" as const,
    title: "Hesap olusturuldu",
    description:
      "Calisan kaydi sisteme eklendi ve erisim yetkileri tanimlandi.",
    timestamp: "15 Mar 2021",
  },
];

const relatedRecords = [
  {
    id: "PRJ-101",
    name: "Yeni Depo Otomasyon Sistemi",
    status: "active" as const,
    startDate: "2024-01-10",
    endDate: "2024-08-30",
  },
  {
    id: "PRJ-087",
    name: "Stok Sayim Sureci Iyilestirme",
    status: "completed" as const,
    startDate: "2023-09-01",
    endDate: "2024-02-28",
  },
  {
    id: "PRJ-115",
    name: "Vardiya Planlama Modulu",
    status: "active" as const,
    startDate: "2024-04-15",
    endDate: "2024-12-31",
  },
  {
    id: "PRJ-120",
    name: "Kargo Entegrasyon Projesi",
    status: "pending" as const,
    startDate: "2024-07-01",
    endDate: "2025-03-31",
  },
  {
    id: "PRJ-065",
    name: "Depo Ici Navigasyon Sistemi",
    status: "cancelled" as const,
    startDate: "2023-06-01",
    endDate: "2023-11-15",
  },
];

// ---------------------------------------------------------------------------
// Yardimci Bilesenler & Sabitler
// ---------------------------------------------------------------------------

const statusMap: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  active: { label: "Aktif", variant: "default" },
  completed: { label: "Tamamlandi", variant: "secondary" },
  pending: { label: "Beklemede", variant: "outline" },
  cancelled: { label: "Iptal", variant: "destructive" },
};

const activityDotColor: Record<string, string> = {
  info: "bg-blue-500",
  warning: "bg-amber-500",
  success: "bg-emerald-500",
  default: "bg-muted-foreground/50",
};

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[140px_1fr] items-start gap-2 py-3">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Ana Bilesen
// ---------------------------------------------------------------------------

export function DetailTemplatePage() {
  const fullName = `${employee.firstName} ${employee.lastName}`;
  const initials = `${employee.firstName[0]}${employee.lastName[0]}`;
  const empStatus = statusMap[employee.status];

  return (
    <div>
      {/* Geri butonu */}
      <Button
        variant="ghost"
        size="sm"
        className="mb-4 -ml-2 gap-1.5 text-muted-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Geri
      </Button>

      {/* Baslik alani: Avatar + Bilgi + Durum Badge + Aksiyonlar */}
      <div className="mb-2 flex items-start gap-4">
        <Avatar className="h-14 w-14 text-lg">
          <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <PageHeader
            title={fullName}
            description={`${employee.id} · ${employee.department} · ${employee.position}`}
            actions={
              <div className="flex items-center gap-2">
                <Badge variant={empStatus.variant}>{empStatus.label}</Badge>
                <Separator orientation="vertical" className="h-5" />
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Pencil className="h-4 w-4" />
                  Duzenle
                </Button>
                <Button variant="destructive" size="sm" className="gap-1.5">
                  <Trash2 className="h-4 w-4" />
                  Sil
                </Button>
              </div>
            }
          />
        </div>
      </div>

      {/* Sekmeler */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">Genel Bilgiler</TabsTrigger>
          <TabsTrigger value="activity">Aktivite Gecmisi</TabsTrigger>
          <TabsTrigger value="related">Iliskili Kayitlar</TabsTrigger>
        </TabsList>

        {/* ----- Tab 1: Genel Bilgiler ----- */}
        <TabsContent value="general">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Kisisel Bilgiler */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Kisisel Bilgiler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-0 divide-y">
                <InfoRow
                  label="Ad Soyad"
                  value={fullName}
                  icon={<User className="h-4 w-4" />}
                />
                <InfoRow
                  label="Email"
                  value={employee.email}
                  icon={<Mail className="h-4 w-4" />}
                />
                <InfoRow
                  label="Telefon"
                  value={employee.phone}
                  icon={<Phone className="h-4 w-4" />}
                />
                <InfoRow
                  label="Departman"
                  value={employee.department}
                  icon={<Building className="h-4 w-4" />}
                />
                <InfoRow label="Pozisyon" value={employee.position} />
                <InfoRow
                  label="Baslangic Tarihi"
                  value={new Date(employee.startDate).toLocaleDateString(
                    "tr-TR",
                    { day: "numeric", month: "long", year: "numeric" }
                  )}
                  icon={<Calendar className="h-4 w-4" />}
                />
              </CardContent>
            </Card>

            {/* Iletisim & Adres */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Iletisim & Adres</CardTitle>
              </CardHeader>
              <CardContent className="space-y-0 divide-y">
                <InfoRow label="Adres" value={employee.address} />
                <InfoRow label="Sehir" value={employee.city} />
                <InfoRow label="Posta Kodu" value={employee.postalCode} />
                <InfoRow
                  label="Acil Durum Kisisi"
                  value={employee.emergencyContact}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ----- Tab 2: Aktivite Gecmisi ----- */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Aktivite Gecmisi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-0">
                {activityItems.map((item, index) => {
                  const isLast = index === activityItems.length - 1;
                  const dotColor =
                    activityDotColor[item.type] || activityDotColor.default;

                  return (
                    <div
                      key={item.id}
                      className="relative flex gap-4 pb-8 last:pb-0"
                    >
                      {/* Dikey cizgi + nokta */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${dotColor}`}
                        />
                        {!isLast && (
                          <div className="w-px flex-1 bg-border" />
                        )}
                      </div>

                      {/* Icerik */}
                      <div className="flex-1 space-y-1 pb-2">
                        <p className="text-sm font-medium leading-tight">
                          {item.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                        <p className="flex items-center gap-1 text-xs text-muted-foreground/70">
                          <Clock className="h-3 w-3" />
                          {item.timestamp}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ----- Tab 3: Iliskili Kayitlar ----- */}
        <TabsContent value="related">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Iliskili Kayitlar</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Proje Adi</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Baslangic
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Bitis
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {relatedRecords.map((record) => {
                    const st = statusMap[record.status];
                    return (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div>
                            <span className="font-medium">{record.name}</span>
                            <span className="ml-2 text-xs text-muted-foreground">
                              {record.id}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={st.variant}>{st.label}</Badge>
                        </TableCell>
                        <TableCell className="hidden text-muted-foreground sm:table-cell">
                          {new Date(record.startDate).toLocaleDateString(
                            "tr-TR"
                          )}
                        </TableCell>
                        <TableCell className="hidden text-muted-foreground sm:table-cell">
                          {new Date(record.endDate).toLocaleDateString(
                            "tr-TR"
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
