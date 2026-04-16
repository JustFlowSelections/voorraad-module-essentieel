import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FolderTree, GripVertical, Loader2, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type LevelOption = { key: string; label: string };

function SortableLevel({
  levelKey,
  label,
  index,
  onRemove,
}: {
  levelKey: string;
  label: string;
  index: number;
  onRemove: (key: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: levelKey });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between rounded-lg border border-border p-3 bg-background"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          type="button"
          className="cursor-grab active:cursor-grabbing touch-none"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </button>
        <span className="text-sm font-medium text-muted-foreground w-6">{index + 1}.</span>
        <span className="font-medium truncate">{label}</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(levelKey)}
        className="text-destructive hover:text-destructive"
        title="Verwijderen"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function InventoryNavigationCard() {
  const [levels, setLevels] = useState<string[]>(["potSize", "color", "shade"]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [availableLevels, setAvailableLevels] = useState<LevelOption[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    (async () => {
      try {
        const [settingsRes, fieldsRes] = await Promise.all([
          supabase.from("inventory_settings").select("hierarchy_levels").maybeSingle(),
          supabase.from("product_field_settings").select("field_key, field_label").order("sort_order"),
        ]);

        if (settingsRes.data?.hierarchy_levels) {
          setLevels(settingsRes.data.hierarchy_levels as string[]);
        }

        const fieldsFromDb: LevelOption[] = (fieldsRes.data ?? []).map((f: any) => ({
          key: f.field_key,
          label: f.field_label,
        }));
        const keys = new Set(fieldsFromDb.map((f) => f.key));
        const extras: LevelOption[] = [];
        if (!keys.has("productType")) extras.push({ key: "productType", label: "Producttype" });
        if (!keys.has("location")) extras.push({ key: "location", label: "Locatie" });

        const all = [...fieldsFromDb, ...extras];
        const seen = new Set<string>();
        const deduped = all.filter((l) => { if (seen.has(l.key)) return false; seen.add(l.key); return true; });

        setAvailableLevels(deduped);
      } catch (e) {
        console.error("Error fetching hierarchy:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setLevels((prev) => {
        const oldIndex = prev.indexOf(active.id as string);
        const newIndex = prev.indexOf(over.id as string);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const handleRemove = (key: string) => {
    setLevels((prev) => prev.filter((l) => l !== key));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: existing } = await supabase.from("inventory_settings").select("id").maybeSingle();
      if (existing) {
        const { error } = await supabase.from("inventory_settings").update({ hierarchy_levels: levels, updated_at: new Date().toISOString() }).eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("inventory_settings").insert({ hierarchy_levels: levels } as any);
        if (error) throw error;
      }
      toast.success("Navigatievolgorde opgeslagen");
    } catch {
      toast.error("Fout bij opslaan");
    } finally {
      setSaving(false);
    }
  };

  const getLevelLabel = (key: string) => availableLevels.find((l) => l.key === key)?.label ?? key;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FolderTree className="h-5 w-5 text-primary" />
          <CardTitle>Voorraad Navigatie</CardTitle>
        </div>
        <CardDescription>Sleep om de mappenstructuur van de voorraad te wijzigen</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <div className="text-xs text-muted-foreground px-1 font-medium">Actieve niveaus (sleep om volgorde te wijzigen)</div>

              {levels.length > 0 ? (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={levels} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                      {levels.map((level, index) => (
                        <SortableLevel
                          key={level}
                          levelKey={level}
                          label={getLevelLabel(level)}
                          index={index}
                          onRemove={handleRemove}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              ) : (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  Geen niveaus geselecteerd
                </div>
              )}

              <div className="flex items-center gap-3 rounded-lg border border-dashed border-border p-3 bg-muted/30">
                <div className="w-4" />
                <span className="text-sm font-medium text-muted-foreground w-6">{levels.length + 1}.</span>
                <span className="font-medium text-muted-foreground">Producten</span>
              </div>
            </div>

            {availableLevels.filter((l) => !levels.includes(l.key)).length > 0 && (
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground px-1 font-medium">Beschikbare niveaus</div>
                <div className="grid grid-cols-2 gap-2">
                  {availableLevels.filter((l) => !levels.includes(l.key)).map((level) => (
                    <label key={level.key} className="flex items-center gap-2 rounded-lg border border-border p-3 bg-card hover:bg-accent cursor-pointer transition-colors">
                      <Checkbox checked={false} onCheckedChange={() => setLevels([...levels, level.key])} />
                      <span className="text-sm">{level.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <Button className="w-full" onClick={handleSave} disabled={saving || levels.length === 0}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Opslaan
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
