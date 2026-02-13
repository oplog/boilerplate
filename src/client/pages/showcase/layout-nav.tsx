// Showcase: Layout & Navigasyon Bileşenleri
// Accordion, Tabs, Breadcrumb, Pagination, Separator, ScrollArea,
// Resizable, Carousel, NavigationMenu, Menubar, Sidebar Varyantları

import { ShowcaseCard } from "@/components/shared/showcase-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";

export function ShowcaseLayoutNav() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Accordion */}
      <ShowcaseCard title="Accordion" description="Genişleyip daralan bölümler">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Sipariş nasıl takip edilir?</AccordionTrigger>
            <AccordionContent>
              Siparişlerinizi "Siparişlerim" sayfasından takip edebilirsiniz. Her siparişin yanındaki detay butonuna tıklayarak güncel durumunu görebilirsiniz.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>İade süreci nasıl işler?</AccordionTrigger>
            <AccordionContent>
              İade talebinizi oluşturduktan sonra 3 iş günü içinde ürününüz teslim alınır. Kontrol sonrası 5 iş günü içinde ödeme iadesi yapılır.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Destek saatleri nelerdir?</AccordionTrigger>
            <AccordionContent>
              Hafta içi 09:00 - 18:00 arası destek hattımız açıktır. Hafta sonu email ile destek alabilirsiniz.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ShowcaseCard>

      {/* Tabs */}
      <ShowcaseCard title="Tabs" description="Sekme navigasyonu">
        <Tabs defaultValue="genel">
          <TabsList className="w-full">
            <TabsTrigger value="genel" className="flex-1">Genel</TabsTrigger>
            <TabsTrigger value="bildirim" className="flex-1">Bildirimler</TabsTrigger>
            <TabsTrigger value="guvenlik" className="flex-1">Güvenlik</TabsTrigger>
          </TabsList>
          <TabsContent value="genel" className="text-sm text-muted-foreground">
            Genel ayarlar burada görünür.
          </TabsContent>
          <TabsContent value="bildirim" className="text-sm text-muted-foreground">
            Bildirim tercihleri burada görünür.
          </TabsContent>
          <TabsContent value="guvenlik" className="text-sm text-muted-foreground">
            Güvenlik ayarları burada görünür.
          </TabsContent>
        </Tabs>
      </ShowcaseCard>

      {/* Breadcrumb */}
      <ShowcaseCard title="Breadcrumb" description="Sayfa yol göstergesi">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">OPLOG</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Siparişler</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>#1001</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </ShowcaseCard>

      {/* Pagination */}
      <ShowcaseCard title="Pagination" description="Sayfa numaralandırma">
        <Pagination>
          <PaginationContent>
            <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
            <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
            <PaginationItem><PaginationLink href="#" isActive>2</PaginationLink></PaginationItem>
            <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
            <PaginationItem><PaginationEllipsis /></PaginationItem>
            <PaginationItem><PaginationNext href="#" /></PaginationItem>
          </PaginationContent>
        </Pagination>
      </ShowcaseCard>

      {/* Separator */}
      <ShowcaseCard title="Separator" description="Yatay ve dikey ayırıcı">
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium">Başlık</p>
            <Separator className="my-2" />
            <p className="text-sm text-muted-foreground">İçerik burada</p>
          </div>
          <div className="flex h-5 items-center space-x-4 text-sm">
            <span>Blog</span>
            <Separator orientation="vertical" />
            <span>Dökümanlar</span>
            <Separator orientation="vertical" />
            <span>Kaynak</span>
          </div>
        </div>
      </ShowcaseCard>

      {/* Scroll Area */}
      <ShowcaseCard title="Scroll Area" description="Özelleştirilmiş kaydırma alanı">
        <ScrollArea className="h-[150px] rounded-md border p-3">
          <div className="space-y-2">
            {Array.from({ length: 15 }, (_, i) => (
              <div key={i} className="text-sm">
                Satır {i + 1} — Kaydırılabilir içerik
              </div>
            ))}
          </div>
        </ScrollArea>
      </ShowcaseCard>

      {/* Resizable */}
      <ShowcaseCard title="Resizable" description="Boyutlandırılabilir paneller" className="md:col-span-2">
        <ResizablePanelGroup direction="horizontal" className="min-h-[100px] rounded-lg border">
          <ResizablePanel defaultSize={50}>
            <div className="flex h-full items-center justify-center p-4">
              <span className="text-sm font-medium">Panel A</span>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50}>
            <div className="flex h-full items-center justify-center p-4">
              <span className="text-sm font-medium">Panel B</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ShowcaseCard>

      {/* Carousel */}
      <ShowcaseCard title="Carousel" description="Kaydırılabilir galeri">
        <Carousel className="mx-auto w-full max-w-xs">
          <CarouselContent>
            {Array.from({ length: 5 }, (_, i) => (
              <CarouselItem key={i}>
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-4">
                    <span className="text-3xl font-semibold">{i + 1}</span>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </ShowcaseCard>

      {/* Menubar */}
      <ShowcaseCard title="Menubar" description="Menü çubuğu">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>Dosya</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Yeni Dosya</MenubarItem>
              <MenubarItem>Aç</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Kaydet</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Düzenle</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Geri Al</MenubarItem>
              <MenubarItem>İleri Al</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Kes</MenubarItem>
              <MenubarItem>Kopyala</MenubarItem>
              <MenubarItem>Yapıştır</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </ShowcaseCard>

      {/* Sidebar Variants */}
      <ShowcaseCard title="Sidebar Varyantları" description="5 farklı sidebar stili mevcut">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Bu projede 5 farklı sidebar varyantı mevcuttur. Örnekleri görmek için:
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link to="/examples/sidebar">
              <ExternalLink className="mr-2 h-3 w-3" />
              Sidebar Örnekleri
            </Link>
          </Button>
        </div>
      </ShowcaseCard>
    </div>
  );
}
