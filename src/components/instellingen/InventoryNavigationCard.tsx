import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FolderTree, GripVertical, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type LevelOption = { key: string; label: string };

export function InventoryNavigationCard() {
  const [levels, setLevels] = useState<string[]>(["potSize", "color", "shade"]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [availableLevels, setAvailableLevels] = useState<LevelOption[]>([]);

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

        // Build available levels from all field settings + always include productType & location
        const fieldsFromDb: LevelOption[] = (fieldsRes.data ?? []).map((f: any) => ({
          key: f.field_key,
          label: f.field_label,
        }));
        const keys = new Set(fieldsFromDb.map((f) => f.key));
        const extras: LevelOption[] = [];
        if (!keys.has("productType")) extras.push({ key: "productType", label: "Producttype" });
        if (!keys.has("location")) extras.push({ key: "location", label: "Locatie" });

        // Deduplicate by key
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

  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const newLevels = [...levels];
    const [removed] = newLevels.splice(dragIndex, 1);
    newLevels.splice(index, 0, removed);
    setLevels(newLevels);
    setDragIndex(index);
  };
  const handleDragEnd = () => setDragIndex(null);

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
              {levels.map((level, index) => (
                <div
                  key={level}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-3 rounded-lg border border-border p-3 bg-card cursor-grab active:cursor-grabbing transition-colors ${dragIndex === index ? "border-primary bg-accent" : ""}`}
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm font-medium text-muted-foreground w-6">{index + 1}.</span>
                  <span className="font-medium flex-1">{getLevelLabel(level)}</span>
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-destructive hover:text-destructive" onClick={() => setLevels(levels.filter((l) => l !== level))}>
                    Verwijderen
                  </Button>
                </div>
              ))}
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
