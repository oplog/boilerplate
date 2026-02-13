// Showcase: Overlay & Geri Bildirim Bileşenleri
// Dialog, AlertDialog, Sheet, Drawer, Popover, HoverCard,
// Tooltip, DropdownMenu, ContextMenu, Command, Toast, Alert

import { useState } from "react";
import { ShowcaseCard } from "@/components/shared/showcase-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  AlertTriangle,
  CheckCircle,
  Info,
  MoreHorizontal,
  Settings,
  User,
  LogOut,
  Bell,
} from "lucide-react";

export function ShowcaseOverlayFeedback() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Dialog */}
      <ShowcaseCard title="Dialog" description="Modal pencere">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Dialog Aç</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Kayıt</DialogTitle>
              <DialogDescription>Yeni bir kayıt oluşturun.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div className="space-y-1">
                <Label>İsim</Label>
                <Input placeholder="İsim giriniz" />
              </div>
              <div className="space-y-1">
                <Label>Email</Label>
                <Input type="email" placeholder="email@oplog.com" />
              </div>
            </div>
            <DialogFooter>
              <Button>Kaydet</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </ShowcaseCard>

      {/* Alert Dialog */}
      <ShowcaseCard title="Alert Dialog" description="Onay diyaloğu">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Kaydı Sil</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
              <AlertDialogDescription>
                Bu işlem geri alınamaz. Kayıt kalıcı olarak silinecektir.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>İptal</AlertDialogCancel>
              <AlertDialogAction>Sil</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </ShowcaseCard>

      {/* Sheet */}
      <ShowcaseCard title="Sheet" description="Yandan açılan panel">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Sheet Aç</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Ayarlar</SheetTitle>
              <SheetDescription>
                Uygulama ayarlarınızı buradan düzenleyebilirsiniz.
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-3 py-4">
              <div className="space-y-1">
                <Label>Kullanıcı Adı</Label>
                <Input defaultValue="ahmet.yilmaz" />
              </div>
              <div className="space-y-1">
                <Label>Email</Label>
                <Input defaultValue="ahmet@oplog.com" />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </ShowcaseCard>

      {/* Drawer */}
      <ShowcaseCard title="Drawer" description="Alt panel (mobilde ideal)">
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">Drawer Aç</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Filtrele</DrawerTitle>
              <DrawerDescription>Sonuçları daraltmak için filtre seçin.</DrawerDescription>
            </DrawerHeader>
            <div className="px-4 pb-4">
              <p className="text-sm text-muted-foreground">Filtre seçenekleri burada görünür.</p>
            </div>
            <DrawerFooter>
              <Button>Uygula</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </ShowcaseCard>

      {/* Popover */}
      <ShowcaseCard title="Popover" description="Açılır içerik kutusu">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Popover
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Boyutlar</h4>
              <div className="grid gap-2">
                <div className="grid grid-cols-3 items-center gap-3">
                  <Label className="text-xs">Genişlik</Label>
                  <Input className="col-span-2 h-8" defaultValue="100%" />
                </div>
                <div className="grid grid-cols-3 items-center gap-3">
                  <Label className="text-xs">Yükseklik</Label>
                  <Input className="col-span-2 h-8" defaultValue="auto" />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </ShowcaseCard>

      {/* Hover Card */}
      <ShowcaseCard title="Hover Card" description="Hover ile açılan kart">
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link" className="p-0">@oplog</Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-64">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">OPLOG</h4>
              <p className="text-xs text-muted-foreground">
                Türkiye'nin lider fulfillment şirketi. E-ticaret lojistik çözümleri.
              </p>
              <div className="flex items-center text-xs text-muted-foreground">
                <span>İstanbul, Türkiye</span>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </ShowcaseCard>

      {/* Tooltip */}
      <ShowcaseCard title="Tooltip" description="Hover bilgi baloncuğu">
        <TooltipProvider>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Bell className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Bildirimler</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Ayarlar</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <User className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Profil</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </ShowcaseCard>

      {/* Dropdown Menu */}
      <ShowcaseCard title="Dropdown Menu" description="Açılır menü">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <MoreHorizontal className="mr-2 h-4 w-4" />
              Menü
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Hesabım</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />Profil
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />Ayarlar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />Çıkış Yap
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ShowcaseCard>

      {/* Context Menu */}
      <ShowcaseCard title="Context Menu" description="Sağ tıklama menüsü">
        <ContextMenu>
          <ContextMenuTrigger className="flex h-[80px] w-full items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
            Sağ tıklayın
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Kopyala</ContextMenuItem>
            <ContextMenuItem>Yapıştır</ContextMenuItem>
            <ContextMenuItem>Sil</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </ShowcaseCard>

      {/* Toast (Sonner) */}
      <ShowcaseCard title="Toast (Sonner)" description="Bildirim mesajları">
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => toast.success("İşlem başarılı!")}>
            Başarılı
          </Button>
          <Button size="sm" variant="destructive" onClick={() => toast.error("Bir hata oluştu!")}>
            Hata
          </Button>
          <Button size="sm" variant="outline" onClick={() => toast.info("Bilgi mesajı")}>
            Bilgi
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() =>
              toast("Kayıt silindi", {
                action: { label: "Geri Al", onClick: () => toast.success("Geri alındı!") },
              })
            }
          >
            Geri Alınabilir
          </Button>
        </div>
      </ShowcaseCard>

      {/* Alert */}
      <ShowcaseCard title="Alert" description="Bildirim kutuları" className="md:col-span-2">
        <div className="space-y-3">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Bilgi</AlertTitle>
            <AlertDescription>Sisteme yeni bir güncelleme yüklendi.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Hata</AlertTitle>
            <AlertDescription>Bağlantı zaman aşımına uğradı. Lütfen tekrar deneyin.</AlertDescription>
          </Alert>
        </div>
      </ShowcaseCard>
    </div>
  );
}
