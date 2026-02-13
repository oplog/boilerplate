// Showcase: Gelişmiş Bileşenler
// DataGrid (mini), Kanban, Sortable, Collapsible

import { useState } from "react";
import { ShowcaseCard } from "@/components/shared/showcase-card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
  SortableOverlay,
} from "@/components/ui/sortable";
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnHandle,
  KanbanItem,
  KanbanOverlay,
} from "@/components/ui/kanban";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronsUpDown, GripVertical } from "lucide-react";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";

type KanbanTask = {
  id: string;
  title: string;
};

type KanbanColumnData = {
  id: string;
  title: string;
  tasks: KanbanTask[];
};

const initialColumns: KanbanColumnData[] = [
  {
    id: "bekleyen",
    title: "Bekleyen",
    tasks: [
      { id: "t1", title: "Sayfa tasarımı" },
      { id: "t2", title: "API entegrasyonu" },
    ],
  },
  {
    id: "devam",
    title: "Devam Eden",
    tasks: [{ id: "t3", title: "Dashboard geliştirme" }],
  },
  {
    id: "tamam",
    title: "Tamamlanan",
    tasks: [{ id: "t4", title: "Giriş sayfası" }],
  },
];

const sortableItems = [
  { id: "1", label: "Depo Yönetimi" },
  { id: "2", label: "Sipariş Takibi" },
  { id: "3", label: "Envanter Sayımı" },
  { id: "4", label: "Raporlama" },
  { id: "5", label: "Kargo Entegrasyonu" },
];

export function ShowcaseAdvanced() {
  const [columns, setColumns] = useState(initialColumns);
  const [items, setItems] = useState(sortableItems);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Kanban (DiceUI) */}
      <ShowcaseCard
        title="Kanban Board"
        description="Sürükle-bırak görev panosu (DiceUI). Tam şablon için Kanban şablonuna bakın."
        className="md:col-span-2"
      >
        <Kanban
          value={columns}
          onValueChange={setColumns}
          getColumnValue={(col) => col.id}
          getColumnItems={(col) => col.tasks}
          getItemValue={(item) => item.id}
          onItemMove={({ activeItem, targetColumn, newIndex }) => {
            setColumns((prev) =>
              prev.map((col) => {
                // Remove from source column
                const filteredTasks = col.tasks.filter((t) => t.id !== activeItem.id);
                if (col.id === targetColumn.id) {
                  // Add to target column at new index
                  const task = prev.flatMap((c) => c.tasks).find((t) => t.id === activeItem.id);
                  if (task) {
                    const newTasks = [...filteredTasks];
                    newTasks.splice(newIndex, 0, task);
                    return { ...col, tasks: newTasks };
                  }
                }
                return { ...col, tasks: filteredTasks };
              })
            );
          }}
        >
          <KanbanBoard>
            {columns.map((column) => (
              <KanbanColumn key={column.id} value={column} className="min-w-[200px]">
                <KanbanColumnHandle className="mb-2 flex items-center gap-2 font-medium">
                  {column.title}
                  <Badge variant="secondary" className="ml-auto">
                    {column.tasks.length}
                  </Badge>
                </KanbanColumnHandle>
                {column.tasks.map((task) => (
                  <KanbanItem key={task.id} value={task} asHandle>
                    <Card className="cursor-grab">
                      <CardContent className="p-3">
                        <p className="text-sm">{task.title}</p>
                      </CardContent>
                    </Card>
                  </KanbanItem>
                ))}
              </KanbanColumn>
            ))}
          </KanbanBoard>
          <KanbanOverlay>
            {(activeItem) => (
              <Card className="rotate-2 shadow-lg">
                <CardContent className="p-3">
                  <p className="text-sm">{(activeItem.value as KanbanTask).title}</p>
                </CardContent>
              </Card>
            )}
          </KanbanOverlay>
        </Kanban>
        <div className="mt-3">
          <Button variant="outline" size="sm" asChild>
            <Link to="/templates/kanban">
              <ExternalLink className="mr-2 h-3 w-3" />
              Kanban Şablonu
            </Link>
          </Button>
        </div>
      </ShowcaseCard>

      {/* Sortable (DiceUI) */}
      <ShowcaseCard title="Sortable" description="Sürükle-bırak sıralama (DiceUI)">
        <Sortable
          value={items}
          onValueChange={setItems}
          getItemValue={(item) => item.id}
        >
          <SortableContent>
            {items.map((item) => (
              <SortableItem key={item.id} value={item} asHandle>
                <div className="flex items-center gap-2 rounded-md border p-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{item.label}</span>
                </div>
              </SortableItem>
            ))}
          </SortableContent>
          <SortableOverlay />
        </Sortable>
      </ShowcaseCard>

      {/* Collapsible */}
      <ShowcaseCard title="Collapsible" description="Açılır/kapanır bölüm">
        <Collapsible>
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">3 modül mevcut</h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                <ChevronsUpDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
          </div>
          <div className="mt-2 rounded-md border p-2 text-sm">
            Depo Yönetimi Modülü
          </div>
          <CollapsibleContent className="space-y-2 mt-2">
            <div className="rounded-md border p-2 text-sm">
              Sipariş Takip Sistemi
            </div>
            <div className="rounded-md border p-2 text-sm">
              Envanter Sayım Aracı
            </div>
          </CollapsibleContent>
        </Collapsible>
      </ShowcaseCard>

      {/* DataGrid Reference */}
      <ShowcaseCard
        title="DataGrid (Excel-benzeri)"
        description="DiceUI DataGrid — düzenlenebilir hücreler, sıralama, formüller. Tam demo için:"
        className="md:col-span-2"
      >
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            DataGrid bileşeni DirectionProvider + TooltipProvider sarmalama gerektirir ve
            büyük bir bileşendir. Tam çalışan demo'yu görmek için DataGrid örnek sayfasına gidin.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/examples/datagrid">
                <ExternalLink className="mr-2 h-3 w-3" />
                DataGrid Örneği
              </Link>
            </Button>
          </div>
          <div className="rounded-md border bg-muted/50 p-3">
            <p className="text-xs font-medium mb-1">Desteklenen hücre tipleri:</p>
            <div className="flex flex-wrap gap-1">
              {["short-text", "long-text", "number", "url", "checkbox", "select", "multi-select", "date", "file"].map(
                (type) => (
                  <Badge key={type} variant="secondary" className="text-xs">
                    {type}
                  </Badge>
                )
              )}
            </div>
          </div>
        </div>
      </ShowcaseCard>
    </div>
  );
}
