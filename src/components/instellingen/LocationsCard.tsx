import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Warehouse, Plus, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Location {
  id: string;
  name: string;
  sort_order: number;
}

export function LocationsCard() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase.from("locations").select("*").order("sort_order");
      if (error) throw error;
      setLocations(data || []);
    } catch {
      toast.error("Fout bij ophalen van locaties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLocations(); }, []);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    try {
      const { error } = await supabase.from("locations").insert({ name: newName.trim(), sort_order: locations.length } as any);
      if (error) {
        if (error.code === "23505") toast.error("Deze locatie bestaat al");
        else throw error;
        return;
      }
      toast.success(`Locatie "${newName.trim()}" toegevoegd`);
      setNewName("");
      await fetchLocations();
    } catch {
      toast.error("Fout bij toevoegen van locatie");
    }
  };

  const handleDelete = async (loc: Location) => {
    if (!confirm(`Weet u zeker dat u "${loc.name}" wilt verwijderen?`)) return;
    try {
      const { error } = await supabase.from("locations").delete().eq("id", loc.id);
      if (error) throw error;
      toast.success(`Locatie "${loc.name}" verwijderd`);
      await fetchLocations();
    } catch {
      toast.error("Fout bij verwijderen van locatie");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Warehouse className="h-5 w-5 text-primary" />
          <CardTitle>Locaties</CardTitle>
        </div>
        <CardDescription>Beheer uw kassen en opslaglocaties</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : locations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">Geen locaties gevonden</div>
        ) : (
          <div className="space-y-3 max-h-[280px] overflow-y-auto">
            {locations.map((loc) => (
              <div key={loc.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <span className="font-medium">{loc.name}</span>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(loc)} className="text-destructive hover:text-destructive" title="Verwijderen">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <Input placeholder="Nieuwe locatie naam..." value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAdd()} />
          <Button variant="outline" onClick={handleAdd} disabled={!newName.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            Toevoegen
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
