import { useState, useEffect } from "react";
import { Button } from "@flowselections/core";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@flowselections/core";
import { Input } from "@flowselections/core";
import { Label } from "@flowselections/core";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@flowselections/core";
import { RefreshCw, ArrowLeft, Loader2 } from "lucide-react";
import { DynamicIcon } from "../ui/icon-picker";
import { supabase } from "@flowselections/core";
import { useProductFieldSettings, FieldSetting } from "../../hooks/useProductFieldSettings";
import { getCategoryBgClass, getCategoryIconClass } from "../../lib/categoryColors";

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
  color: string | null;
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

// Standard field keys that map to top-level product properties (not custom_fields)
const STANDARD_FIELD_MAP: Record<string, keyof NewProduct> = {
  product: "product",
  batch: "batch",
  location: "location",
  quantity: "quantity",
  min_quantity: "minQuantity",
  unit: "unit",
  barcode: "barcode",
  purchase_price: "purchasePrice",
  sale_price: "salePrice",
};

// Core fields that get their own structured layout at the top
const CORE_FIELD_KEYS = new Set(["product", "barcode", "batch", "location", "quantity", "min_quantity", "unit", "purchase_price", "sale_price"]);

// Fields that need special UI rendering
const SPECIAL_FIELDS = new Set(["location", "unit", "barcode"]);



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
  const { fields: activeFields } = useProductFieldSettings(selectedCategory);

  useEffect(() => {
    if (!open) return;
    setLoadingCategories(true);
    (async () => {
      const [locRes, catRes] = await Promise.all([
        supabase.from("locations").select("name").order("sort_order"),
        supabase.from("product_categories").select("id, name, slug, icon, color").order("sort_order"),
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

  const getFieldValue = (field: FieldSetting): any => {
    const standardKey = STANDARD_FIELD_MAP[field.field_key];
    if (standardKey) return formData[standardKey] ?? "";
    return formData.customFields[field.field_key] ?? "";
  };

  const setFieldValue = (field: FieldSetting, value: any) => {
    const standardKey = STANDARD_FIELD_MAP[field.field_key];
    if (standardKey) {
      setFormData((prev) => ({ ...prev, [standardKey]: value }));
    } else {
      setFormData((prev) => ({
        ...prev,
        customFields: { ...prev.customFields, [field.field_key]: value },
      }));
    }
  };

  const selectedCategoryName = categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory;

  // Deduplicate fields by field_key (keep first occurrence)
  const deduped = activeFields.filter((f, i, arr) => arr.findIndex((x) => x.field_key === f.field_key) === i);

  // Required fields that must always show as top-level inputs
  const REQUIRED_KEYS = new Set(["product"]);

  const renderField = (field: FieldSetting) => {
    const isRequired = REQUIRED_KEYS.has(field.field_key);

    // Special: Location dropdown
    if (field.field_key === "location") {
      return (
        <div key={field.id} className="grid gap-2">
          <Label>{field.field_label} *</Label>
          <Select value={String(getFieldValue(field))} onValueChange={(v) => setFieldValue(field, v)}>
            <SelectTrigger><SelectValue placeholder="Kies locatie" /></SelectTrigger>
            <SelectContent>
              {locations.length > 0 ? locations.map((loc) => (
                <SelectItem key={loc} value={loc}>{loc}</SelectItem>
              )) : (
                <SelectItem value="Onbekend">Onbekend</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      );
    }

    // Special: Unit dropdown
    if (field.field_key === "unit") {
      return (
        <div key={field.id} className="grid gap-2">
          <Label>{field.field_label}</Label>
          <Select value={String(getFieldValue(field))} onValueChange={(v) => setFieldValue(field, v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="stuks">Stuks</SelectItem>
              <SelectItem value="bossen">Bossen</SelectItem>
              <SelectItem value="dozen">Dozen</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    }

    // Special: Barcode with regenerate button
    if (field.field_key === "barcode") {
      return (
        <div key={field.id} className="grid gap-2">
          <Label>{field.field_label}</Label>
          <div className="flex gap-2">
            <Input value={String(getFieldValue(field))} onChange={(e) => setFieldValue(field, e.target.value)} placeholder="Automatisch gegenereerd" className="font-mono" />
            <Button type="button" variant="outline" size="icon" onClick={regenerateBarcode} title="Nieuwe barcode genereren"><RefreshCw className="h-4 w-4" /></Button>
          </div>
        </div>
      );
    }

    // Select-type custom field
    if (field.field_type === "select") {
      return (
        <div key={field.id} className="grid gap-2">
          <Label>{field.field_label}</Label>
          <Select value={String(getFieldValue(field) || "")} onValueChange={(v) => setFieldValue(field, v)}>
            <SelectTrigger><SelectValue placeholder="Kies..." /></SelectTrigger>
            <SelectContent>
              {(field.options || []).map((opt) => (
                <SelectItem key={opt.id} value={opt.label}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    // Number field
    if (field.field_type === "number") {
      const isPriceField = field.field_key === "purchase_price" || field.field_key === "sale_price";
      return (
        <div key={field.id} className="grid gap-2">
          <Label>{field.field_label}{isPriceField ? " (€)" : ""}{isRequired ? " *" : ""}</Label>
          <Input
            type="number"
            min="0"
            step={isPriceField ? "0.01" : "1"}
            value={getFieldValue(field)}
            onChange={(e) => setFieldValue(field, field.field_key === "purchase_price" || field.field_key === "sale_price" ? (parseFloat(e.target.value) || 0) : (parseInt(e.target.value) || 0))}
            required={isRequired}
            placeholder={isPriceField ? "0.00" : undefined}
          />
        </div>
      );
    }

    // Default: text field
    return (
      <div key={field.id} className="grid gap-2">
        <Label>{field.field_label}{isRequired ? " *" : ""}</Label>
        <Input
          type="text"
          value={String(getFieldValue(field) || "")}
          onChange={(e) => setFieldValue(field, e.target.value || null)}
          required={isRequired}
        />
      </div>
    );
  };

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
              {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectType(cat)}
                    className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-border bg-card hover:border-primary hover:bg-accent transition-all group"
                  >
                    <div className={`h-14 w-14 rounded-full flex items-center justify-center transition-colors ${getCategoryBgClass(cat.color)}`}>
                      <DynamicIcon name={cat.icon} className={`h-7 w-7 ${getCategoryIconClass(cat.color)}`} />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">{cat.name}</p>
                    </div>
                  </button>
              ))}
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
            {/* Core fields - structured layout */}
            {deduped.filter((f) => CORE_FIELD_KEYS.has(f.field_key)).map((field) => renderField(field))}

            {/* Extra fields from settings */}
            {deduped.filter((f) => !CORE_FIELD_KEYS.has(f.field_key)).length > 0 && (
              <div className="space-y-3 pt-2">
                <Label className="text-sm font-medium text-muted-foreground">Extra velden</Label>
                <div className="grid grid-cols-2 gap-4">
                  {deduped.filter((f) => !CORE_FIELD_KEYS.has(f.field_key)).map((field) => renderField(field))}
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
