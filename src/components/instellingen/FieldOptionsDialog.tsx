import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@flowselections/core";
import { Button } from "@flowselections/core";
import { Input } from "@flowselections/core";
import { Loader2, Plus, Trash2, GripVertical } from "lucide-react";
import { supabase } from "@flowselections/core";
import { toast } from "sonner";

interface FieldOption {
  id: string;
  label: string;
  sort_order: number;
}

interface FieldOptionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fieldId: string | null;
  fieldLabel: string;
}

export function FieldOptionsDialog({ open, onOpenChange, fieldId, fieldLabel }: FieldOptionsDialogProps) {
  const [options, setOptions] = useState<FieldOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [newOption, setNewOption] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open || !fieldId) return;
    setLoading(true);
    supabase
      .from("product_field_options")
      .select("id, label, sort_order")
      .eq("field_setting_id", fieldId)
      .order("sort_order")
      .then(({ data, error }) => {
        if (error) console.error("Error fetching options:", error);
        else setOptions((data as FieldOption[]) ?? []);
        setLoading(false);
      });
  }, [open, fieldId]);

  const handleAdd = async () => {
    if (!fieldId || !newOption.trim()) return;
    setSaving(true);
    const maxSort = options.reduce((max, o) => Math.max(max, o.sort_order), -1);
    try {
      const { data, error } = await supabase
        .from("product_field_options")
        .insert({ field_setting_id: fieldId, label: newOption.trim(), sort_order: maxSort + 1 } as any)
        .select("id, label, sort_order")
        .single();
      if (error) throw error;
      setOptions((prev) => [...prev, data as FieldOption]);
      setNewOption("");
      toast.success(`"${newOption.trim()}" toegevoegd`);
    } catch {
      toast.error("Fout bij toevoegen");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (option: FieldOption) => {
    try {
      const { error } = await supabase.from("product_field_options").delete().eq("id", option.id);
      if (error) throw error;
      setOptions((prev) => prev.filter((o) => o.id !== option.id));
    } catch {
      toast.error("Fout bij verwijderen");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Keuzelijst: {fieldLabel}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {options.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Nog geen keuzes toegevoegd</p>
                ) : (
                  options.map((option) => (
                    <div key={option.id} className="flex items-center gap-2 rounded-lg border border-border p-2.5">
                      <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="flex-1 text-sm font-medium">{option.label}</span>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDelete(option)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
              <div className="flex gap-2">
                <Input value={newOption} onChange={(e) => setNewOption(e.target.value)} placeholder="Nieuwe keuze..." onKeyDown={(e) => e.key === "Enter" && handleAdd()} />
                <Button onClick={handleAdd} disabled={!newOption.trim() || saving} size="sm">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
