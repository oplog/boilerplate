// Showcase: Veri Gösterim Bileşenleri
// Table, Card, Badge, Avatar, Progress, Skeleton, Chart, Stat, Status, Timeline, Stepper, Tour

import { ShowcaseCard } from "@/components/shared/showcase-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Stat,
  StatDescription,
  StatLabel,
  StatTrend,
  StatValue,
} from "@/components/ui/stat";
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineDot,
  TimelineHeader,
  TimelineItem,
  TimelineTitle,
} from "@/components/ui/timeline";
import {
  Stepper,
  StepperContent,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";
import { Kbd } from "@/components/ui/kbd";
import { TrendingUp, TrendingDown, Package, Truck, CheckCircle } from "lucide-react";

export function ShowcaseDataDisplay() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Table */}
      <ShowcaseCard title="Table" description="Veri tablosu" className="md:col-span-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sipariş</TableHead>
              <TableHead>Müşteri</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="text-right">Tutar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">#1001</TableCell>
              <TableCell>Ali Yılmaz</TableCell>
              <TableCell><Badge>Tamamlandı</Badge></TableCell>
              <TableCell className="text-right">₺1,250</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">#1002</TableCell>
              <TableCell>Ayşe Demir</TableCell>
              <TableCell><Badge variant="secondary">Hazırlanıyor</Badge></TableCell>
              <TableCell className="text-right">₺890</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">#1003</TableCell>
              <TableCell>Mehmet Kara</TableCell>
              <TableCell><Badge variant="destructive">İptal</Badge></TableCell>
              <TableCell className="text-right">₺2,100</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </ShowcaseCard>

      {/* Card */}
      <ShowcaseCard title="Card" description="Kart bileşeni">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Toplam Gelir</CardTitle>
            <CardDescription className="text-xs">Son 30 gün</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₺45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% geçen aydan</p>
          </CardContent>
        </Card>
      </ShowcaseCard>

      {/* Badge */}
      <ShowcaseCard title="Badge" description="4 varyant: default, secondary, destructive, outline">
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </ShowcaseCard>

      {/* Avatar */}
      <ShowcaseCard title="Avatar" description="Kullanıcı avatarı">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AY</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>MD</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>EK</AvatarFallback>
          </Avatar>
          <div className="flex -space-x-2">
            <Avatar className="border-2 border-background">
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <Avatar className="border-2 border-background">
              <AvatarFallback>B</AvatarFallback>
            </Avatar>
            <Avatar className="border-2 border-background">
              <AvatarFallback>+3</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </ShowcaseCard>

      {/* Progress */}
      <ShowcaseCard title="Progress" description="İlerleme çubuğu">
        <div className="space-y-3">
          <div>
            <div className="mb-1 flex justify-between text-xs">
              <span>Depo Doluluk</span><span>65%</span>
            </div>
            <Progress value={65} />
          </div>
          <div>
            <div className="mb-1 flex justify-between text-xs">
              <span>Sipariş Tamamlanma</span><span>89%</span>
            </div>
            <Progress value={89} />
          </div>
          <div>
            <div className="mb-1 flex justify-between text-xs">
              <span>Yükleniyor...</span><span>33%</span>
            </div>
            <Progress value={33} />
          </div>
        </div>
      </ShowcaseCard>

      {/* Skeleton */}
      <ShowcaseCard title="Skeleton" description="Yükleme placeholder'ı">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-3 w-[150px]" />
            </div>
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-20 w-full" />
        </div>
      </ShowcaseCard>

      {/* Stat (DiceUI) */}
      <ShowcaseCard title="Stat" description="İstatistik kartı (DiceUI)">
        <div className="grid gap-3">
          <Stat>
            <StatLabel>Toplam Sipariş</StatLabel>
            <StatValue>12,543</StatValue>
            <StatTrend variant="up">
              <TrendingUp className="h-3 w-3" />
              +12.5%
            </StatTrend>
          </Stat>
          <Stat>
            <StatLabel>İade Oranı</StatLabel>
            <StatValue>2.4%</StatValue>
            <StatTrend variant="down">
              <TrendingDown className="h-3 w-3" />
              -0.3%
            </StatTrend>
          </Stat>
        </div>
      </ShowcaseCard>

      {/* Status (DiceUI) */}
      <ShowcaseCard title="Status" description="Durum göstergesi (DiceUI)">
        <div className="space-y-2">
          <Status>
            <StatusIndicator variant="online" />
            <StatusLabel>Çevrimiçi</StatusLabel>
          </Status>
          <Status>
            <StatusIndicator variant="busy" />
            <StatusLabel>Meşgul</StatusLabel>
          </Status>
          <Status>
            <StatusIndicator variant="away" />
            <StatusLabel>Uzakta</StatusLabel>
          </Status>
          <Status>
            <StatusIndicator variant="offline" />
            <StatusLabel>Çevrimdışı</StatusLabel>
          </Status>
        </div>
      </ShowcaseCard>

      {/* Timeline (DiceUI) */}
      <ShowcaseCard title="Timeline" description="Zaman çizelgesi (DiceUI)">
        <Timeline>
          <TimelineItem>
            <TimelineDot>
              <Package className="h-3 w-3" />
            </TimelineDot>
            <TimelineConnector />
            <TimelineContent>
              <TimelineHeader>
                <TimelineTitle>Sipariş Alındı</TimelineTitle>
              </TimelineHeader>
              <TimelineDescription>10:30 — Sipariş sisteme girdi</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineDot>
              <Truck className="h-3 w-3" />
            </TimelineDot>
            <TimelineConnector />
            <TimelineContent>
              <TimelineHeader>
                <TimelineTitle>Kargoya Verildi</TimelineTitle>
              </TimelineHeader>
              <TimelineDescription>14:00 — Depodan çıktı</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineDot>
              <CheckCircle className="h-3 w-3" />
            </TimelineDot>
            <TimelineContent>
              <TimelineHeader>
                <TimelineTitle>Teslim Edildi</TimelineTitle>
              </TimelineHeader>
              <TimelineDescription>Ertesi gün 09:15</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </ShowcaseCard>

      {/* Stepper (DiceUI) */}
      <ShowcaseCard title="Stepper" description="Çok adımlı wizard (DiceUI)" className="md:col-span-2">
        <Stepper defaultValue={2}>
          <StepperList>
            <StepperItem step={1}>
              <StepperTrigger>
                <StepperIndicator />
                <div>
                  <StepperTitle>Bilgiler</StepperTitle>
                  <StepperDescription>Temel bilgiler</StepperDescription>
                </div>
              </StepperTrigger>
              <StepperSeparator />
            </StepperItem>
            <StepperItem step={2}>
              <StepperTrigger>
                <StepperIndicator />
                <div>
                  <StepperTitle>Doğrulama</StepperTitle>
                  <StepperDescription>Kimlik doğrula</StepperDescription>
                </div>
              </StepperTrigger>
              <StepperSeparator />
            </StepperItem>
            <StepperItem step={3}>
              <StepperTrigger>
                <StepperIndicator />
                <div>
                  <StepperTitle>Tamamla</StepperTitle>
                  <StepperDescription>Onay ve gönder</StepperDescription>
                </div>
              </StepperTrigger>
            </StepperItem>
          </StepperList>
          <StepperContent step={1}>Adım 1 içeriği buraya gelir.</StepperContent>
          <StepperContent step={2}>Adım 2 içeriği buraya gelir.</StepperContent>
          <StepperContent step={3}>Adım 3 içeriği buraya gelir.</StepperContent>
        </Stepper>
      </ShowcaseCard>

      {/* Kbd */}
      <ShowcaseCard title="Kbd" description="Klavye kısayol gösterimi">
        <div className="flex flex-wrap gap-2">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
          <Kbd>⌘C</Kbd>
          <Kbd>Ctrl</Kbd>
          <Kbd>Shift</Kbd>
          <Kbd>Enter</Kbd>
          <Kbd>Esc</Kbd>
        </div>
      </ShowcaseCard>
    </div>
  );
}
