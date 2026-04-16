import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Package, Plus, Trash2, GripVertical, List, Leaf, Box } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FieldOptionsDialog } from "./FieldOptionsDialog";

export interface FieldSetting {
  id: string;
  field_key: string;
  field_label: string;
  field_type: string;
  is_active: boolean;
  is_custom: boolean;
  sort_order: number;
  applies_to: string;
}

interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

function FieldList({
  fields,
  onToggle,
  onDelete,
  onOpenOptions,
}: {
  fields: FieldSetting[];
  onToggle: (field: FieldSetting) => void;
  onDelete: (field: FieldSetting) => void;
  onOpenOptions: (field: FieldSetting) => void;
}) {
  if (fields.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground text-sm">
        Geen velden geconfigureerd
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
      {fields.map((field) => (
        <div
          key={field.id}
          className="flex items-center justify-between rounded-lg border border-border p-3"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <Switch
              checked={field.is_active}
              onCheckedChange={() => onToggle(field)}
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
      ))}
    </div>
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

      setFields((fieldsRes.data as unknown as FieldSetting[]) || []);
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

  useEffect(() => { fetchData(); }, []);

  const handleToggle = async (field: FieldSetting) => {
    const newActive = !field.is_active;
    setFields((prev) => prev.map((f) => (f.id === field.id ? { ...f, is_active: newActive } : f)));
    const { error } = await supabase
      .from("product_field_settings")
      .update({ is_active: newActive, updated_at: new Date().toISOString() } as any)
      .eq("id", field.id);
    if (error) {
      setFields((prev) => prev.map((f) => (f.id === field.id ? { ...f, is_active: !newActive } : f)));
      toast.error("Fout bij bijwerken van veld");
    }
  };

  const handleAddCustomField = async () => {
    if (!newLabel.trim()) return;
    const fieldKey = `custom_${Date.now()}`;
    const maxSort = fields.reduce((max, f) => Math.max(max, f.sort_order), 0);
    try {
      const { error } = await supabase.from("product_field_settings").insert({
        field_key: fieldKey,
        field_label: newLabel.trim(),
        field_type: newType,
        is_active: true,
        is_custom: true,
        sort_order: maxSort + 1,
        applies_to: newAppliesTo,
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
    fields.filter((f) => f.applies_to === slug || f.applies_to === "beide");

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
                      {cat.slug === "levend" ? <Leaf className="h-4 w-4" /> : <Box className="h-4 w-4" />}
                      {cat.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {categories.map((cat) => (
                  <TabsContent key={cat.slug} value={cat.slug} className="mt-4 space-y-4">
                    <FieldList
                      fields={getFieldsForTab(cat.slug)}
                      onToggle={handleToggle}
                      onDelete={handleDeleteField}
                      onOpenOptions={handleOpenOptions}
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
