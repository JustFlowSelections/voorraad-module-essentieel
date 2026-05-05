import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@flowselections/core";
import { Button } from "@flowselections/core";
import { Switch } from "@flowselections/core";
import { Input } from "@flowselections/core";
import { Label } from "@flowselections/core";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@flowselections/core";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@flowselections/core";
import { Loader2, Package, Plus, Trash2, GripVertical, List } from "lucide-react";
import { DynamicIcon } from "../ui/icon-picker";
import { supabase } from "@flowselections/core";
import { toast } from "sonner";
import { FieldOptionsDialog } from "./FieldOptionsDialog";
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

export interface FieldSetting {
  id: string;
  field_key: string;
  field_label: string;
  field_type: string;
  is_custom: boolean;
  sort_order: number;
  active_per_category: Record<string, boolean>;
}

interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
}

const REQUIRED_FIELD_KEYS = new Set(["product", "location"]);

function SortableFieldItem({
  field,
  categorySlug,
  onToggle,
  onDelete,
  onOpenOptions,
}: {
  field: FieldSetting;
  categorySlug: string;
  onToggle: (field: FieldSetting, categorySlug: string) => void;
  onDelete: (field: FieldSetting) => void;
  onOpenOptions: (field: FieldSetting) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isActive = field.active_per_category?.[categorySlug] ?? false;
  const isRequired = REQUIRED_FIELD_KEYS.has(field.field_key);

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
        <Switch
          checked={isRequired ? true : isActive}
          disabled={isRequired}
          onCheckedChange={() => onToggle(field, categorySlug)}
        />
        <div className="min-w-0">
          <p className="font-medium truncate">{field.field_label}</p>
          {field.is_custom && (
            <p className="text-xs text-muted-foreground">
              Aangepast · {field.field_type === "number" ? "Nummer" : field.field_type === "select" ? "Keuzelijst" : "Tekst"}
            </p>
          )}
        </div>
      </div>
      {field.is_custom && (
        <div className="flex gap-1 ml-2">
          {field.field_type === "select" && (
            <Button variant="ghost" size="icon" onClick={() => onOpenOptions(field)} title="Keuzes beheren">
              <List className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={() => onDelete(field)} className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

function FieldList({
  fields,
  categorySlug,
  onToggle,
  onDelete,
  onOpenOptions,
  onReorder,
}: {
  fields: FieldSetting[];
  categorySlug: string;
  onToggle: (field: FieldSetting, categorySlug: string) => void;
  onDelete: (field: FieldSetting) => void;
  onOpenOptions: (field: FieldSetting) => void;
  onReorder: (activeId: string, overId: string) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  if (fields.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground text-sm">
        Geen velden geconfigureerd
      </div>
    );
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      onReorder(active.id as string, over.id as string);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {fields.map((field) => (
            <SortableFieldItem
              key={field.id}
              field={field}
              categorySlug={categorySlug}
              onToggle={onToggle}
              onDelete={onDelete}
              onOpenOptions={onOpenOptions}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

export function ProductFieldsCard({ refreshKey }: { refreshKey?: number }) {
  const [fields, setFields] = useState<FieldSetting[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newType, setNewType] = useState("text");
  const [newAppliesTo, setNewAppliesTo] = useState("beide");
  const [optionsDialogOpen, setOptionsDialogOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<FieldSetting | null>(null);
  const [activeTab, setActiveTab] = useState("");

  const fetchData = async () => {
    try {
      const [fieldsRes, catsRes] = await Promise.all([
        supabase.from("product_field_settings").select("*").order("sort_order"),
        supabase.from("product_categories").select("*").order("sort_order"),
      ]);

      if (fieldsRes.error) throw fieldsRes.error;
      if (catsRes.error) throw catsRes.error;

      const rawFields = (fieldsRes.data || []) as unknown as FieldSetting[];
      const normalized = rawFields.map((f) => ({
        ...f,
        active_per_category: (f.active_per_category && typeof f.active_per_category === "object") ? f.active_per_category : {},
      }));
      setFields(normalized);
      const cats = (catsRes.data as unknown as ProductCategory[]) || [];
      setCategories(cats);
      if (cats.length > 0 && !activeTab) setActiveTab(cats[0].slug);
    } catch (error) {
      console.error("Error fetching field settings:", error);
      toast.error("Fout bij ophalen van veldinstellingen");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [refreshKey]);

  const handleToggle = async (field: FieldSetting, categorySlug: string) => {
    const currentActive = field.active_per_category?.[categorySlug] ?? false;
    const newActive = !currentActive;
    const newPerCategory = { ...field.active_per_category, [categorySlug]: newActive };

    setFields((prev) => prev.map((f) => (f.id === field.id ? { ...f, active_per_category: newPerCategory } : f)));

    const { error } = await supabase
      .from("product_field_settings")
      .update({ active_per_category: newPerCategory, updated_at: new Date().toISOString() } as any)
      .eq("id", field.id);

    if (error) {
      setFields((prev) => prev.map((f) => (f.id === field.id ? { ...f, active_per_category: field.active_per_category } : f)));
      toast.error("Fout bij bijwerken van veld");
    }
  };

  const handleReorder = async (activeId: string, overId: string) => {
    const oldIndex = fields.findIndex((f) => f.id === activeId);
    const newIndex = fields.findIndex((f) => f.id === overId);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(fields, oldIndex, newIndex);
    // Assign new sort_order values
    const updated = reordered.map((f, i) => ({ ...f, sort_order: i }));
    setFields(updated);

    // Persist all changed sort_orders
    try {
      const updates = updated
        .filter((f, i) => fields[i]?.id !== f.id) // only changed positions
        .map((f) =>
          supabase
            .from("product_field_settings")
            .update({ sort_order: f.sort_order, updated_at: new Date().toISOString() } as any)
            .eq("id", f.id)
        );
      // Actually update all items to be safe
      const allUpdates = updated.map((f) =>
        supabase
          .from("product_field_settings")
          .update({ sort_order: f.sort_order, updated_at: new Date().toISOString() } as any)
          .eq("id", f.id)
      );
      await Promise.all(allUpdates);
    } catch (error) {
      toast.error("Fout bij opslaan van volgorde");
      await fetchData(); // revert
    }
  };

  const handleAddCustomField = async () => {
    if (!newLabel.trim()) return;
    const fieldKey = `custom_${Date.now()}`;
    const maxSort = fields.reduce((max, f) => Math.max(max, f.sort_order), 0);

    const activePerCategory: Record<string, boolean> = {};
    for (const cat of categories) {
      if (newAppliesTo === "beide" || newAppliesTo === cat.slug) {
        activePerCategory[cat.slug] = true;
      } else {
        activePerCategory[cat.slug] = false;
      }
    }

    try {
      const { error } = await supabase.from("product_field_settings").insert({
        field_key: fieldKey,
        field_label: newLabel.trim(),
        field_type: newType,
        is_custom: true,
        sort_order: maxSort + 1,
        active_per_category: activePerCategory,
      } as any);
      if (error) throw error;
      toast.success(`Veld "${newLabel.trim()}" toegevoegd`);
      setNewLabel("");
      setNewType("text");
      setShowAddForm(false);
      await fetchData();
    } catch (error) {
      console.error("Error adding custom field:", error);
      toast.error("Fout bij toevoegen van veld");
    }
  };

  const handleDeleteField = async (field: FieldSetting) => {
    if (!confirm(`Weet u zeker dat u "${field.field_label}" wilt verwijderen?`)) return;
    try {
      const { error } = await supabase.from("product_field_settings").delete().eq("id", field.id);
      if (error) throw error;
      toast.success(`Veld "${field.field_label}" verwijderd`);
      setFields((prev) => prev.filter((f) => f.id !== field.id));
    } catch (error) {
      toast.error("Fout bij verwijderen van veld");
    }
  };

  const handleOpenOptions = (field: FieldSetting) => {
    setSelectedField(field);
    setOptionsDialogOpen(true);
  };

  const getFieldsForTab = (slug: string) =>
    fields.filter((f) => f.active_per_category && slug in f.active_per_category);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          <CardTitle>Productvelden</CardTitle>
        </div>
        <CardDescription>Bepaal welke gegevens u bijhoudt per productcategorie</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {categories.length > 0 && (
              <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setShowAddForm(false); }}>
                <TabsList className="w-full">
                  {categories.map((cat) => (
                    <TabsTrigger key={cat.slug} value={cat.slug} className="flex-1 gap-2">
                      <DynamicIcon name={cat.icon} className="h-4 w-4" />
                      {cat.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {categories.map((cat) => (
                  <TabsContent key={cat.slug} value={cat.slug} className="mt-4 space-y-4">
                    <FieldList
                      fields={getFieldsForTab(cat.slug)}
                      categorySlug={cat.slug}
                      onToggle={handleToggle}
                      onDelete={handleDeleteField}
                      onOpenOptions={handleOpenOptions}
                      onReorder={handleReorder}
                    />
                  </TabsContent>
                ))}
              </Tabs>
            )}

            {showAddForm ? (
              <div className="space-y-3 rounded-lg border border-border p-4">
                <div className="space-y-2">
                  <Label>Veldnaam</Label>
                  <Input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="Bijv. Materiaal type" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={newType} onValueChange={setNewType}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Tekst</SelectItem>
                        <SelectItem value="number">Nummer</SelectItem>
                        <SelectItem value="select">Keuzelijst</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Van toepassing op</Label>
                    <Select value={newAppliesTo} onValueChange={setNewAppliesTo}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.slug} value={cat.slug}>{cat.name}</SelectItem>
                        ))}
                        <SelectItem value="beide">Alle categorieën</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddCustomField} disabled={!newLabel.trim()} className="flex-1">Toevoegen</Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)} className="flex-1">Annuleren</Button>
                </div>
              </div>
            ) : (
              <Button variant="outline" className="w-full" onClick={() => {
                setNewAppliesTo(activeTab || "beide");
                setShowAddForm(true);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Veld Toevoegen
              </Button>
            )}
          </>
        )}
      </CardContent>

      <FieldOptionsDialog
        open={optionsDialogOpen}
        onOpenChange={setOptionsDialogOpen}
        fieldId={selectedField?.id ?? null}
        fieldLabel={selectedField?.field_label ?? ""}
      />
    </Card>
  );
}
