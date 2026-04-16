import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { RefreshCw, ArrowLeft, Loader2 } from "lucide-react";
import { DynamicIcon } from "@/components/ui/icon-picker";
import { supabase } from "@/integrations/supabase/client";
import { useProductFieldSettings } from "@/hooks/useProductFieldSettings";

export interface NewProduct {
  product: string;
  batch: string;
  location: string;
  quantity: number;
  minQuantity: number;
  unit: string;
  barcode: string;
  purchasePrice: number;
  salePrice: number;
  plantType: string | null;
  potSize: string | null;
  color: string | null;
  shade: string | null;
  vbnCode: string | null;
  piecesPerTray: number | null;
  plantHeight: string | null;
  qualityGroup: string | null;
  productType: string;
  imageUrl: string | null;
  fullColor: string | null;
  incomingQuantity: number;
  economicQuantity: number;
  customFields: Record<string, any>;
  [key: string]: any;
}

interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
}

const generateBarcode = () => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `${timestamp}${random}`;
};

const defaultFormData: NewProduct = {
  product: "", batch: "", location: "", quantity: 0, minQuantity: 0, unit: "stuks",
  barcode: "", purchasePrice: 0, salePrice: 0, plantType: null, potSize: null,
  color: null, shade: null, vbnCode: null, piecesPerTray: null, plantHeight: null,
  qualityGroup: null, productType: "", imageUrl: null, fullColor: null,
  incomingQuantity: 0, economicQuantity: 0, customFields: {},
};

const CATEGORY_COLORS: Record<string, string> = {
  levend: "bg-emerald-500/10 group-hover:bg-emerald-500/20",
  dood: "bg-amber-500/10 group-hover:bg-amber-500/20",
};

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (product: NewProduct) => void;
}

export function AddProductDialog({ open, onOpenChange, onAdd }: AddProductDialogProps) {
  const [step, setStep] = useState<"type" | "form">("type");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [formData, setFormData] = useState<NewProduct>({ ...defaultFormData });
  const [locations, setLocations] = useState<string[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const { fields: customFields } = useProductFieldSettings(selectedCategory);

  // Fetch categories every time the dialog opens
  useEffect(() => {
    if (!open) return;
    setLoadingCategories(true);
    (async () => {
      const [locRes, catRes] = await Promise.all([
        supabase.from("locations").select("name").order("sort_order"),
        supabase.from("product_categories").select("id, name, slug, icon").order("sort_order"),
      ]);
      if (locRes.data) setLocations(locRes.data.map((l) => l.name));
      if (catRes.data) setCategories(catRes.data as unknown as ProductCategory[]);
      setLoadingCategories(false);
    })();
  }, [open]);

  useEffect(() => {
    if (open) {
      setStep("type");
      setSelectedCategory(null);
      setFormData({ ...defaultFormData, barcode: generateBarcode() });
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    onOpenChange(false);
  };

  const handleSelectType = (cat: ProductCategory) => {
    setSelectedCategory(cat.slug);
    setFormData({ ...defaultFormData, barcode: generateBarcode(), productType: cat.slug, customFields: {} });
    setStep("form");
  };

  const regenerateBarcode = () => {
    setFormData((prev) => ({ ...prev, barcode: generateBarcode() }));
  };

  const setCustomField = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      customFields: { ...prev.customFields, [key]: value },
    }));
  };

  const selectedCategoryName = categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory;

  if (step === "type") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Nieuw Product Toevoegen</DialogTitle>
            <DialogDescription>Kies het type voorraad dat u wilt toevoegen.</DialogDescription>
          </DialogHeader>
          {loadingCategories ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Geen categorieën gevonden. Voeg eerst categorieën toe via Instellingen.
            </div>
          ) : (
            <div className={`grid gap-4 py-6 ${categories.length === 1 ? "grid-cols-1 max-w-[200px] mx-auto" : categories.length === 2 ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-3"}`}>
              {categories.map((cat) => {
                const colorClass = CATEGORY_COLORS[cat.slug] || "bg-primary/10 group-hover:bg-primary/20";
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectType(cat)}
                    className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-border bg-card hover:border-primary hover:bg-accent transition-all group"
                  >
                    <div className={`h-14 w-14 rounded-full flex items-center justify-center transition-colors ${colorClass}`}>
                      <DynamicIcon name={cat.icon} className="h-7 w-7" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">{cat.name}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setStep("type")}><ArrowLeft className="h-4 w-4" /></Button>
            {selectedCategoryName} Product
          </DialogTitle>
          <DialogDescription>Vul de gegevens in om een nieuw product toe te voegen.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid gap-2">
              <Label htmlFor="product">Productnaam *</Label>
              <Input id="product" placeholder="bijv. Rode Tulpen" value={formData.product} onChange={(e) => setFormData({ ...formData, product: e.target.value })} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="barcode">Barcode</Label>
              <div className="flex gap-2">
                <Input id="barcode" value={formData.barcode} onChange={(e) => setFormData({ ...formData, barcode: e.target.value })} placeholder="Automatisch gegenereerd" className="font-mono" />
                <Button type="button" variant="outline" size="icon" onClick={regenerateBarcode} title="Nieuwe barcode genereren"><RefreshCw className="h-4 w-4" /></Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="batch">Partijnummer *</Label>
                <Input id="batch" placeholder="bijv. TUL-2024-001" value={formData.batch} onChange={(e) => setFormData({ ...formData, batch: e.target.value })} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Locatie *</Label>
                <Select value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })}>
                  <SelectTrigger id="location"><SelectValue placeholder="Kies locatie" /></SelectTrigger>
                  <SelectContent>
                    {locations.length > 0 ? locations.map((loc) => (<SelectItem key={loc} value={loc}>{loc}</SelectItem>)) : (<SelectItem value="Onbekend">Onbekend</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="quantity">Aantal *</Label>
                <Input id="quantity" type="number" min="0" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="minQuantity">Minimum *</Label>
                <Input id="minQuantity" type="number" min="0" value={formData.minQuantity} onChange={(e) => setFormData({ ...formData, minQuantity: parseInt(e.target.value) || 0 })} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="unit">Eenheid</Label>
                <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                  <SelectTrigger id="unit"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stuks">Stuks</SelectItem>
                    <SelectItem value="bossen">Bossen</SelectItem>
                    <SelectItem value="dozen">Dozen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="purchasePrice">Inkoopprijs (€)</Label>
                <Input id="purchasePrice" type="number" min="0" step="0.01" value={formData.purchasePrice} onChange={(e) => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) || 0 })} placeholder="0.00" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="salePrice">Verkoopprijs (€)</Label>
                <Input id="salePrice" type="number" min="0" step="0.01" value={formData.salePrice} onChange={(e) => setFormData({ ...formData, salePrice: parseFloat(e.target.value) || 0 })} placeholder="0.00" />
              </div>
            </div>

            {/* Dynamic custom fields from product_field_settings */}
            {customFields.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Extra velden</Label>
                <div className="grid grid-cols-2 gap-4">
                  {customFields.map((field) => (
                    <div key={field.id} className="grid gap-2">
                      <Label>{field.field_label}</Label>
                      {field.field_type === "select" ? (
                        <Select
                          value={formData.customFields[field.field_key] || ""}
                          onValueChange={(v) => setCustomField(field.field_key, v)}
                        >
                          <SelectTrigger><SelectValue placeholder="Kies..." /></SelectTrigger>
                          <SelectContent>
                            {(field.options || []).map((opt) => (
                              <SelectItem key={opt.id} value={opt.label}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          type={field.field_type === "number" ? "number" : "text"}
                          value={formData.customFields[field.field_key] || ""}
                          onChange={(e) => setCustomField(field.field_key, field.field_type === "number" ? (parseFloat(e.target.value) || "") : e.target.value)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Annuleren</Button>
            <Button type="submit">Toevoegen</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
