import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tags, Plus, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { IconPicker, DynamicIcon } from "@/components/ui/icon-picker";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  sort_order: number;
}

interface Props {
  onCategoriesChanged?: () => void;
}

export function ProductCategoriesCard({ onCategoriesChanged }: Props) {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState<string>("tag");
  const [deleteTarget, setDeleteTarget] = useState<ProductCategory | null>(null);
  const [usageCount, setUsageCount] = useState(0);
  const [checkingUsage, setCheckingUsage] = useState(false);

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
        icon: newIcon,
        sort_order: categories.length,
      } as any);
      if (error) {
        if (error.code === "23505") toast.error("Deze categorie bestaat al");
        else throw error;
        return;
      }
      toast.success(`Categorie "${newName.trim()}" toegevoegd`);
      setNewName("");
      setNewIcon("tag");
      await fetchCategories();
      onCategoriesChanged?.();
    } catch {
      toast.error("Fout bij toevoegen van categorie");
    }
  };

  const handleDeleteClick = async (cat: ProductCategory) => {
    setCheckingUsage(true);
    setDeleteTarget(cat);
    try {
      // Check how many products use this category slug as product_type
      const { count, error } = await supabase
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("product_type", cat.slug);
      if (error) throw error;
      setUsageCount(count || 0);
    } catch {
      setUsageCount(0);
    } finally {
      setCheckingUsage(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const { error } = await supabase.from("product_categories").delete().eq("id", deleteTarget.id);
      if (error) throw error;
      toast.success(`Categorie "${deleteTarget.name}" verwijderd`);
      setDeleteTarget(null);
      await fetchCategories();
      onCategoriesChanged?.();
    } catch {
      toast.error("Fout bij verwijderen van categorie");
    }
  };

  return (
    <>
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
                  <div className="flex items-center gap-2">
                    <DynamicIcon name={cat.icon} className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{cat.name}</span>
                    <span className="text-xs text-muted-foreground">({cat.slug})</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(cat)} className="text-destructive hover:text-destructive" title="Verwijderen">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <IconPicker value={newIcon} onChange={setNewIcon} />
            <Input placeholder="Nieuwe categorie naam..." value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAdd()} />
            <Button variant="outline" onClick={handleAdd} disabled={!newName.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Toevoegen
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Categorie verwijderen</AlertDialogTitle>
            <AlertDialogDescription>
              {checkingUsage ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Gebruik controleren...
                </span>
              ) : usageCount > 0 ? (
                <>
                  <span className="font-semibold text-destructive">Let op:</span> De categorie "{deleteTarget?.name}" wordt momenteel gebruikt door{" "}
                  <span className="font-semibold">{usageCount} product{usageCount !== 1 ? "en" : ""}</span> in de voorraad.
                  <br /><br />
                  Weet u zeker dat u deze categorie wilt verwijderen? De producten behouden hun huidige type, maar de categorie zal niet meer beschikbaar zijn.
                </>
              ) : (
                <>Weet u zeker dat u de categorie "{deleteTarget?.name}" wilt verwijderen?</>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuleren</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={checkingUsage} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Verwijderen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
