# Bilesen Ekleme Rehberi (shadcn/ui)

Bu rehber, uygulamaya yeni UI bilesenleri eklemenin yollarini anlatir. Proje, **shadcn/ui** bilesen kutuphanesini kullanir. shadcn/ui, kopyalanabilir ve ozellestirilebilir React bilesenleri saglar.

---

## shadcn/ui Nedir?

shadcn/ui, hazir UI bilesenleri sunan bir kutuphanedir. Normal kutuphanelerden farki, bilesenlerin dogrudan projenize kopyalanmasidir. Bu sayede her bileseni istediginiz gibi ozellestirebilirsiniz.

Bilesenler `src/client/components/ui/` dizininde bulunur.

---

## Mevcut Bilesenler

Projede su shadcn/ui bilesenleri yukludur:

| Bilesen | Dosya | Aciklama |
|---------|-------|----------|
| Badge | `ui/badge.tsx` | Etiket/rozet (durum gostergesi) |
| Button | `ui/button.tsx` | Buton (primary, secondary, outline, ghost, destructive) |
| Card | `ui/card.tsx` | Kart (baslik, icerik, alt bilgi) |
| Dialog | `ui/dialog.tsx` | Modal pencere |
| Dropdown Menu | `ui/dropdown-menu.tsx` | Acilir menu |
| Form | `ui/form.tsx` | Form (React Hook Form entegrasyonlu) |
| Input | `ui/input.tsx` | Metin girisi |
| Label | `ui/label.tsx` | Form etiketi |
| Select | `ui/select.tsx` | Secim kutusu |
| Separator | `ui/separator.tsx` | Ayirici cizgi |
| Sheet | `ui/sheet.tsx` | Yan panel |
| Skeleton | `ui/skeleton.tsx` | Yukleniyor placeholder |
| Sonner | `ui/sonner.tsx` | Toast bildirimleri |
| Table | `ui/table.tsx` | Tablo |
| Tabs | `ui/tabs.tsx` | Sekmeler |
| Textarea | `ui/textarea.tsx` | Cok satirli metin girisi |

---

## Yeni Bilesen Ekleme

### shadcn/ui'den Bilesen Ekleme

```bash
npx shadcn@latest add <bilesen-adi>
```

### Sik Kullanilan Bilesenler

```bash
# Tarih secici
npx shadcn@latest add calendar
npx shadcn@latest add date-picker

# On/off anahtar
npx shadcn@latest add switch

# Ilerleme cubugu
npx shadcn@latest add progress

# Sayfa gezinme
npx shadcn@latest add pagination

# Araclik (hover bilgi)
npx shadcn@latest add tooltip

# Goruntuleyici
npx shadcn@latest add avatar

# Onay kutusu
npx shadcn@latest add checkbox

# Radio butonlari
npx shadcn@latest add radio-group

# Slider
npx shadcn@latest add slider

# Acilir/kapanir icerik
npx shadcn@latest add collapsible
npx shadcn@latest add accordion

# Komut paleti
npx shadcn@latest add command

# Uyari mesaji
npx shadcn@latest add alert
npx shadcn@latest add alert-dialog

# Ekmek kirintisi navigasyonu
npx shadcn@latest add breadcrumb

# Kaydirma alani
npx shadcn@latest add scroll-area
```

### Birden Fazla Bilesen Ekleme

```bash
npx shadcn@latest add switch checkbox radio-group tooltip
```

---

## Bilesen Kullanim Ornekleri

### Button

```tsx
import { Button } from "@/components/ui/button";

// Varyantlar
<Button>Varsayilan</Button>
<Button variant="secondary">Ikincil</Button>
<Button variant="outline">Cerceve</Button>
<Button variant="ghost">Hayalet</Button>
<Button variant="destructive">Tehlikeli</Button>
<Button variant="link">Link</Button>

// Boyutlar
<Button size="sm">Kucuk</Button>
<Button size="default">Normal</Button>
<Button size="lg">Buyuk</Button>
<Button size="icon"><PlusIcon /></Button>

// Devre disi
<Button disabled>Devre Disi</Button>

// Ikonlu
<Button><Plus className="mr-2 h-4 w-4" /> Yeni Ekle</Button>
```

### Card

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Kart Basligi</CardTitle>
    <CardDescription>Kart aciklamasi</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Kart icerigi burada</p>
  </CardContent>
  <CardFooter>
    <Button>Kaydet</Button>
  </CardFooter>
</Card>
```

### Dialog (Modal)

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild>
    <Button>Ac</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Modal Basligi</DialogTitle>
      <DialogDescription>
        Bu bir modal penceredir.
      </DialogDescription>
    </DialogHeader>
    <div className="py-4">
      <p>Modal icerigi</p>
    </div>
    <DialogFooter>
      <Button variant="outline">Iptal</Button>
      <Button>Kaydet</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Table

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Isim</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Durum</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map((item) => (
      <TableRow key={item.id}>
        <TableCell className="font-medium">{item.name}</TableCell>
        <TableCell>{item.email}</TableCell>
        <TableCell>
          <Badge variant={item.active ? "default" : "secondary"}>
            {item.active ? "Aktif" : "Pasif"}
          </Badge>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Form (React Hook Form + Zod)

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const schema = z.object({
  name: z.string().min(1, "Zorunlu"),
  email: z.string().email("Gecersiz email"),
});

function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "" },
  });

  function onSubmit(data: z.infer<typeof schema>) {
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Isim</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Gonder</Button>
      </form>
    </Form>
  );
}
```

### Tabs

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

<Tabs defaultValue="general">
  <TabsList>
    <TabsTrigger value="general">Genel</TabsTrigger>
    <TabsTrigger value="settings">Ayarlar</TabsTrigger>
    <TabsTrigger value="notifications">Bildirimler</TabsTrigger>
  </TabsList>
  <TabsContent value="general">
    <p>Genel icerik</p>
  </TabsContent>
  <TabsContent value="settings">
    <p>Ayarlar icerigi</p>
  </TabsContent>
  <TabsContent value="notifications">
    <p>Bildirimler icerigi</p>
  </TabsContent>
</Tabs>
```

---

## Bilesen Ozellestirme

shadcn/ui bilesenleri dogrudan projenizde bulundugu icin, istediginiz gibi ozellestirebilirsiniz.

### Ornek: Button Rengini Degistirme

`src/client/components/ui/button.tsx` dosyasini ac ve `variants` objesindeki renkleri degistir.

### Ornek: Yeni Bilesen Olusturma

Mevcut bilesenleri birlestirerek yeni bilesenler olusturabilirsiniz:

```tsx
// src/client/components/shared/stat-card.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  change?: string;
  icon: LucideIcon;
};

export function StatCard({ title, value, change, icon: Icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className="text-xs text-muted-foreground">
            <span className="text-green-600">{change}</span> son 30 gun
          </p>
        )}
      </CardContent>
    </Card>
  );
}
```

---

## Claude Code ile Bilesen Ekleme

### Yeni shadcn/ui Bileseni Yukleme

```
> "Projeye checkbox ve switch bilesenlerini ekle"
```

### Mevcut Bileseni Kullanma

```
> "Musteriler sayfasina bir silme onay dialog'u ekle. 'Emin misiniz?' diye sorsun,
   Iptal ve Sil butonlari olsun."
```

### Yeni Paylasilan Bilesen

```
> "Bir StatCard bileseni olustur. title, value, change ve icon prop'lari alsun.
   Dashboard'daki istatistik kartlari gibi gorunsun."
```

### Form Bilesenleri

```
> "Urun ekleme formu olustur. Icerisinde isim (input), kategori (select),
   fiyat (input number), aciklama (textarea) ve aktif mi (switch) alanlari olsun."
```

### Responsive Layout

```
> "Urunler sayfasini grid layout ile goster. Desktop'ta 3 sutun, tablette 2, mobilde 1 sutun olsun.
   Her urun Card bileseni icinde gosterilsin."
```

---

## Ipuclari

1. **shadcn/ui dokumanlari** - [https://ui.shadcn.com/docs](https://ui.shadcn.com/docs) adresinden tum bilesenleri inceleyin
2. **Lucide ikonlari** - [https://lucide.dev/icons](https://lucide.dev/icons) adresinden ikon secin
3. **cn() fonksiyonu** - Class'lari birlestirmek icin `cn()` kullanin: `className={cn("base-class", condition && "conditional-class")}`
4. **Mevcut ornekleri incele** - `src/client/pages/examples/` altindaki dosyalar iyi referanslardir
5. **Bilesen dosyalarini duzenle** - `src/client/components/ui/` altindaki dosyalari istediginiz gibi ozellestirebilirsiniz
