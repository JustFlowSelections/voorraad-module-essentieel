import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tags, Plus, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
}

export function ProductCategoriesCard() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from("product_categories").select("*").order("sort_order");
      if (error) throw error;
      setCategories((data as unknown as ProductCategory[]) || []);
    } catch {
      toast.error("Fout bij ophalen van categorieën");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    const slug = newName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    try {
      const { error } = await supabase.from("product_categories").insert({
        name: newName.trim(),
        slug,
        sort_order: categories.length,
      } as any);
      if (error) {
        if (error.code === "23505") toast.error("Deze categorie bestaat al");
        else throw error;
        return;
      }
      toast.success(`Categorie "${newName.trim()}" toegevoegd`);
      setNewName("");
      await fetchCategories();
    } catch {
      toast.error("Fout bij toevoegen van categorie");
    }
  };

  const handleDelete = async (cat: ProductCategory) => {
    if (!confirm(`Weet u zeker dat u "${cat.name}" wilt verwijderen?`)) return;
    try {
      const { error } = await supabase.from("product_categories").delete().eq("id", cat.id);
      if (error) throw error;
      toast.success(`Categorie "${cat.name}" verwijderd`);
      await fetchCategories();
    } catch {
      toast.error("Fout bij verwijderen van categorie");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Tags className="h-5 w-5 text-primary" />
          <CardTitle>Productcategorieën</CardTitle>
        </div>
        <CardDescription>Beheer de typen voorraad (bijv. Levend, Dood)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">Geen categorieën gevonden</div>
        ) : (
          <div className="space-y-3 max-h-[280px] overflow-y-auto">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <span className="font-medium">{cat.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">({cat.slug})</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(cat)} className="text-destructive hover:text-destructive" title="Verwijderen">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <Input placeholder="Nieuwe categorie naam..." value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAdd()} />
          <Button variant="outline" onClick={handleAdd} disabled={!newName.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            Toevoegen
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
