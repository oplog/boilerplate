// Kanban Board template sayfasi
// Gorev tahtasi - surekle birak olmadan basit "Tasi" butonu ile calisan kanban
// Lojistik/operasyon odakli Turkce mock data ile

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";
import {
  Plus,
  GripVertical,
  MoreHorizontal,
  Calendar,
  Clock,
  ChevronRight,
} from "lucide-react";

// ─── Tipler ────────────────────────────────────────────────

type Priority = "low" | "normal" | "high" | "urgent";
type ColumnId = "backlog" | "in-progress" | "in-review" | "done";

type Task = {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  assignee: string;
  dueDate: string;
  columnId: ColumnId;
};

type Column = {
  id: ColumnId;
  title: string;
  colorClass: string;
  headerBg: string;
  countBg: string;
};

// ─── Sabitler ──────────────────────────────────────────────

const COLUMNS: Column[] = [
  {
    id: "backlog",
    title: "Bekleyen",
    colorClass: "border-l-gray-400 dark:border-l-gray-500",
    headerBg: "bg-gray-100 dark:bg-gray-800",
    countBg: "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  },
  {
    id: "in-progress",
    title: "Devam Eden",
    colorClass: "border-l-blue-500 dark:border-l-blue-400",
    headerBg: "bg-blue-50 dark:bg-blue-950",
    countBg: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
  {
    id: "in-review",
    title: "Incelemede",
    colorClass: "border-l-amber-500 dark:border-l-amber-400",
    headerBg: "bg-amber-50 dark:bg-amber-950",
    countBg:
      "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  },
  {
    id: "done",
    title: "Tamamlandi",
    colorClass: "border-l-green-500 dark:border-l-green-400",
    headerBg: "bg-green-50 dark:bg-green-950",
    countBg:
      "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  },
];

const COLUMN_ORDER: ColumnId[] = [
  "backlog",
  "in-progress",
  "in-review",
  "done",
];

const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; variant: "destructive" | "default" | "secondary" | "outline" }
> = {
  urgent: { label: "Acil", variant: "destructive" },
  high: { label: "Yuksek", variant: "default" },
  normal: { label: "Normal", variant: "secondary" },
  low: { label: "Dusuk", variant: "outline" },
};

const ASSIGNEES = [
  "Ahmet Yilmaz",
  "Elif Demir",
  "Mehmet Kaya",
  "Zeynep Celik",
  "Burak Ozturk",
  "Ayse Sahin",
];

// ─── Mock Data ─────────────────────────────────────────────

const INITIAL_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Depo yerlesim plani guncelleme",
    description:
      "A blok raflari yeniden duzenlenmeli, mevcut kapasite %85'e ulasti",
    priority: "high",
    assignee: "Ahmet Yilmaz",
    dueDate: "2025-02-15",
    columnId: "backlog",
  },
  {
    id: "task-2",
    title: "Barkod okuyucu entegrasyonu",
    description: "Yeni gelen barkod okuyucularin WMS sistemine entegrasyonu",
    priority: "urgent",
    assignee: "Mehmet Kaya",
    dueDate: "2025-02-10",
    columnId: "backlog",
  },
  {
    id: "task-3",
    title: "Sevkiyat raporlama modulu",
    description: "Gunluk sevkiyat ozet raporlarinin otomatik olusturulmasi",
    priority: "normal",
    assignee: "Elif Demir",
    dueDate: "2025-02-20",
    columnId: "backlog",
  },
  {
    id: "task-4",
    title: "Stok sayim sureci iyilestirme",
    description:
      "Haftalik stok sayim surecini 4 saatten 2 saate dusurmek icin is akisi",
    priority: "high",
    assignee: "Zeynep Celik",
    dueDate: "2025-02-12",
    columnId: "in-progress",
  },
  {
    id: "task-5",
    title: "Kargo firmalari API baglantisi",
    description:
      "Yurtici, Aras ve MNG kargo API'leri ile otomatik takip numarasi eslesmesi",
    priority: "urgent",
    assignee: "Burak Ozturk",
    dueDate: "2025-02-08",
    columnId: "in-progress",
  },
  {
    id: "task-6",
    title: "Personel vardiya cizelgesi",
    description: "Depo personeli icin aylık vardiya planlama araci gelistirme",
    priority: "normal",
    assignee: "Ayse Sahin",
    dueDate: "2025-02-25",
    columnId: "in-progress",
  },
  {
    id: "task-7",
    title: "Iade sureci dokumantasyonu",
    description:
      "Musteri iade surecinin adim adim dokumantasyonu ve egitim materyali",
    priority: "low",
    assignee: "Elif Demir",
    dueDate: "2025-02-28",
    columnId: "in-review",
  },
  {
    id: "task-8",
    title: "Siparis onceliklendirme algoritması",
    description:
      "SLA'ya gore siparislerin otomatik oncelik siralamasini yapan algoritma",
    priority: "high",
    assignee: "Mehmet Kaya",
    dueDate: "2025-02-14",
    columnId: "in-review",
  },
  {
    id: "task-9",
    title: "Forklift bakim takvimi",
    description:
      "Tum forkliftler icin periyodik bakim takvimi ve hatirlatma sistemi",
    priority: "normal",
    assignee: "Ahmet Yilmaz",
    dueDate: "2025-02-18",
    columnId: "done",
  },
  {
    id: "task-10",
    title: "Yeni depo otomasyon teklifi",
    description:
      "Konveyor bant ve otomatik paketleme sistemi icin tedarikci teklifleri",
    priority: "low",
    assignee: "Zeynep Celik",
    dueDate: "2025-03-01",
    columnId: "done",
  },
  {
    id: "task-11",
    title: "Musteri dashboard'u tasarimi",
    description:
      "Musterilerin siparis durumlarini takip edebilecegi panel tasarimi",
    priority: "normal",
    assignee: "Burak Ozturk",
    dueDate: "2025-02-22",
    columnId: "backlog",
  },
  {
    id: "task-12",
    title: "Hasar tespit formu dijitallestirme",
    description:
      "Kagit bazli hasar tespit formlarinin dijital ortama tasinmasi",
    priority: "high",
    assignee: "Ayse Sahin",
    dueDate: "2025-02-16",
    columnId: "in-progress",
  },
];

// ─── Yardimci Fonksiyonlar ────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
  });
}

function getNextColumn(currentColumn: ColumnId): ColumnId | null {
  const idx = COLUMN_ORDER.indexOf(currentColumn);
  if (idx < COLUMN_ORDER.length - 1) {
    return COLUMN_ORDER[idx + 1];
  }
  return null;
}

// ─── Gorev Karti Bileseni ─────────────────────────────────

function TaskCard({
  task,
  onMoveNext,
}: {
  task: Task;
  onMoveNext: (taskId: string) => void;
}) {
  const priorityConfig = PRIORITY_CONFIG[task.priority];
  const nextColumn = getNextColumn(task.columnId);
  const nextColumnTitle = nextColumn
    ? COLUMNS.find((c) => c.id === nextColumn)?.title
    : null;

  return (
    <Card className="hover:border-primary/50 transition-colors group cursor-default">
      <CardContent className="p-3 space-y-3">
        {/* Ust kisim: grip + baslik */}
        <div className="flex items-start gap-2">
          <GripVertical className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium leading-snug">{task.title}</h4>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {task.description}
            </p>
          </div>
        </div>

        {/* Oncelik badge */}
        <div className="flex items-center gap-2">
          <Badge variant={priorityConfig.variant} className="text-[10px] px-1.5 py-0">
            {priorityConfig.label}
          </Badge>
        </div>

        <Separator />

        {/* Alt kisim: assignee + tarih */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Avatar size="sm">
              <AvatarFallback className="text-[10px]">
                {getInitials(task.assignee)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground truncate max-w-[80px]">
              {task.assignee.split(" ")[0]}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        </div>

        {/* Tasi butonu */}
        {nextColumn && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onMoveNext(task.id)}
          >
            {nextColumnTitle}
            <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Sutun Bileseni ───────────────────────────────────────

function KanbanColumn({
  column,
  tasks,
  onMoveNext,
}: {
  column: Column;
  tasks: Task[];
  onMoveNext: (taskId: string) => void;
}) {
  return (
    <div className="w-72 shrink-0 flex flex-col">
      {/* Sutun basligi */}
      <div
        className={`rounded-lg px-3 py-2.5 mb-3 border-l-4 ${column.colorClass} ${column.headerBg}`}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{column.title}</h3>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${column.countBg}`}
            >
              {tasks.length}
            </span>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Kartlar */}
      <div className="space-y-2 flex-1 min-h-[200px]">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onMoveNext={onMoveNext} />
        ))}

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 rounded-lg border border-dashed text-muted-foreground">
            <Clock className="h-5 w-5 mb-1" />
            <span className="text-xs">Gorev yok</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Yeni Gorev Dialog'u ──────────────────────────────────

function NewTaskDialog({
  onAdd,
}: {
  onAdd: (task: Omit<Task, "id">) => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("normal");
  const [assignee, setAssignee] = useState(ASSIGNEES[0]);
  const [columnId, setColumnId] = useState<ColumnId>("backlog");
  const [dueDate, setDueDate] = useState("");

  function handleSubmit() {
    if (!title.trim()) return;

    onAdd({
      title: title.trim(),
      description: description.trim(),
      priority,
      assignee,
      columnId,
      dueDate: dueDate || new Date().toISOString().split("T")[0],
    });

    // Formu sifirla
    setTitle("");
    setDescription("");
    setPriority("normal");
    setAssignee(ASSIGNEES[0]);
    setColumnId("backlog");
    setDueDate("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-1.5" />
          Yeni Gorev
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Yeni Gorev Ekle</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {/* Baslik */}
          <div className="space-y-2">
            <Label htmlFor="task-title">Baslik</Label>
            <Input
              id="task-title"
              placeholder="Gorev basligini girin"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Aciklama */}
          <div className="space-y-2">
            <Label htmlFor="task-desc">Aciklama</Label>
            <Textarea
              id="task-desc"
              placeholder="Gorev aciklamasini girin"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Oncelik + Sutun yan yana */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Oncelik</Label>
              <Select
                value={priority}
                onValueChange={(val) => setPriority(val as Priority)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Dusuk</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">Yuksek</SelectItem>
                  <SelectItem value="urgent">Acil</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sutun</Label>
              <Select
                value={columnId}
                onValueChange={(val) => setColumnId(val as ColumnId)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COLUMNS.map((col) => (
                    <SelectItem key={col.id} value={col.id}>
                      {col.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Atanan + Tarih yan yana */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Atanan</Label>
              <Select value={assignee} onValueChange={setAssignee}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ASSIGNEES.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-date">Bitis Tarihi</Label>
              <Input
                id="task-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Iptal</Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={!title.trim()}>
            Ekle
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Ozet Istatistikler ───────────────────────────────────

function BoardStats({ tasks }: { tasks: Task[] }) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.columnId === "done").length;
  const urgent = tasks.filter((t) => t.priority === "urgent").length;
  const inProgress = tasks.filter((t) => t.columnId === "in-progress").length;

  return (
    <div className="flex flex-wrap gap-3 mb-4">
      <div className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm">
        <span className="text-muted-foreground">Toplam:</span>
        <span className="font-semibold">{total}</span>
      </div>
      <div className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm">
        <span className="text-muted-foreground">Devam Eden:</span>
        <span className="font-semibold text-blue-600 dark:text-blue-400">
          {inProgress}
        </span>
      </div>
      <div className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm">
        <span className="text-muted-foreground">Acil:</span>
        <span className="font-semibold text-red-600 dark:text-red-400">
          {urgent}
        </span>
      </div>
      <div className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm">
        <span className="text-muted-foreground">Tamamlanan:</span>
        <span className="font-semibold text-green-600 dark:text-green-400">
          {done}/{total}
        </span>
      </div>
    </div>
  );
}

// ─── Ana Sayfa Bileseni ───────────────────────────────────

export function KanbanTemplatePage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  // Gorevi bir sonraki sutuna tasi
  function handleMoveNext(taskId: string) {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;
        const nextCol = getNextColumn(task.columnId);
        if (!nextCol) return task;
        return { ...task, columnId: nextCol };
      })
    );
  }

  // Yeni gorev ekle
  function handleAddTask(newTask: Omit<Task, "id">) {
    const id = `task-${Date.now()}`;
    setTasks((prev) => [...prev, { ...newTask, id }]);
  }

  return (
    <div>
      <PageHeader
        title="Gorev Tahtasi"
        description="Gorevleri sutunlar arasinda takip edin ve yonetin"
        actions={<NewTaskDialog onAdd={handleAddTask} />}
      />

      <BoardStats tasks={tasks} />

      {/* Kanban tahtasi - yatay scroll */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((column) => {
          const columnTasks = tasks.filter((t) => t.columnId === column.id);
          return (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={columnTasks}
              onMoveNext={handleMoveNext}
            />
          );
        })}
      </div>
    </div>
  );
}
