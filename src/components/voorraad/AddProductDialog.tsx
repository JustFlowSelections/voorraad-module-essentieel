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
import { RefreshCw, Leaf, Box, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface FieldSetting {
  id: string;
  field_key: string;
  field_label: string;
  field_type: string;
  is_active: boolean;
  is_custom: boolean;
  applies_to: string;
  sort_order: number;
}

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
  [key: string]: any;
}

const generateBarcode = () => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `${timestamp}${random}`;
};

const fieldKeyToFormKey: Record<string, string> = {
  product: "product", batch: "batch", location: "location", quantity: "quantity",
  min_quantity: "minQuantity", unit: "unit", barcode: "barcode",
  purchase_price: "purchasePrice", sale_price: "salePrice", plant_type: "plantType",
  pot_size: "potSize", color: "color", shade: "shade", vbn_code: "vbnCode",
  pieces_per_tray: "piecesPerTray", plant_height: "plantHeight", quality_group: "qualityGroup",
};

const defaultFormData: NewProduct = {
  product: "", batch: "", location: "", quantity: 0, minQuantity: 0, unit: "stuks",
  barcode: "", purchasePrice: 0, salePrice: 0, plantType: null, potSize: null,
  color: null, shade: null, vbnCode: null, piecesPerTray: null, plantHeight: null,
  qualityGroup: null, productType: "levende voorraad", imageUrl: null, fullColor: null,
  incomingQuantity: 0, economicQuantity: 0,
};

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (product: NewProduct) => void;
  tenantId: string | null;
}

export function AddProductDialog({ open, onOpenChange, onAdd, tenantId }: AddProductDialogProps) {
  const [step, setStep] = useState<"type" | "form">("type");
  const [productCategory, setProductCategory] = useState<"levend" | "dood" | null>(null);
  const [formData, setFormData] = useState<NewProduct>({ ...defaultFormData });
  const [fieldSettings, setFieldSettings] = useState<FieldSetting[]>([]);
  const [fieldOptions, setFieldOptions] = useState<Record<string, string[]>>({});
  const [locations, setLocations] = useState<string[]>([]);

  useEffect(() => {
    if (!tenantId || !open) return;
    (async () => {
      const [fieldsRes, locationsRes] = await Promise.all([
        supabase.from("product_field_settings").select("*").eq("tenant_id", tenantId).eq("is_active", true).order("sort_order"),
        supabase.from("locations").select("name").eq("tenant_id", tenantId).order("sort_order"),
      ]);
      if (fieldsRes.data) setFieldSettings(fieldsRes.data as unknown as FieldSetting[]);
      if (locationsRes.data) setLocations(locationsRes.data.map((l: any) => l.name));
    })();
  }, [tenantId, open]);

  useEffect(() => {
    if (!tenantId || fieldSettings.length === 0) return;
    const selectFields = fieldSettings.filter((f) => f.field_type === "select");
    if (selectFields.length === 0) return;
    (async () => {
      const { data } = await supabase
        .from("product_field_options").select("field_setting_id, label").eq("tenant_id", tenantId)
        .in("field_setting_id", selectFields.map((f) => f.id)).order("sort_order");
      if (data) {
        const optionsMap: Record<string, string[]> = {};
        data.forEach((opt: any) => {
          if (!optionsMap[opt.field_setting_id]) optionsMap[opt.field_setting_id] = [];
          optionsMap[opt.field_setting_id].push(opt.label);
        });
        setFieldOptions(optionsMap);
      }
    })();
  }, [tenantId, fieldSettings]);

  useEffect(() => {
    if (open) {
      setStep("type");
      setProductCategory(null);
      setFormData({ ...defaultFormData, barcode: generateBarcode() });
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    onOpenChange(false);
  };

  const handleSelectType = (type: "levend" | "dood") => {
    setProductCategory(type);
    setFormData({ ...defaultFormData, barcode: generateBarcode(), productType: type === "levend" ? "levende voorraad" : "dode voorraad" });
    setStep("form");
  };

  const regenerateBarcode = () => {
    setFormData((prev) => ({ ...prev, barcode: generateBarcode() }));
  };

  const activeFields = fieldSettings.filter((f) => {
    if (!productCategory) return false;
    return f.applies_to === "beide" || f.applies_to === productCategory;
  });

  const coreFieldKeys = ["product", "batch", "location", "quantity", "min_quantity", "unit", "barcode", "purchase_price", "sale_price"];
  const excludedFieldKeys = ["product_type"];
  const categoryFields = activeFields.filter((f) => !excludedFieldKeys.includes(f.field_key) && (f.is_custom || !coreFieldKeys.includes(f.field_key)));

  const renderField = (field: FieldSetting) => {
    const formKey = fieldKeyToFormKey[field.field_key] || field.field_key;
    if (field.field_type === "select") {
      const options = fieldOptions[field.id] || [];
      return (
        <div key={field.id} className="grid gap-2">
          <Label>{field.field_label}</Label>
          <Select value={formData[formKey] || ""} onValueChange={(value) => setFormData({ ...formData, [formKey]: value || null })}>
            <SelectTrigger><SelectValue placeholder={`Kies ${field.field_label.toLowerCase()}`} /></SelectTrigger>
            <SelectContent>{options.map((opt) => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
          </Select>
        </div>
      );
    }
    if (field.field_type === "number") {
      return (
        <div key={field.id} className="grid gap-2">
          <Label>{field.field_label}</Label>
          <Input type="number" min="0" value={formData[formKey] ?? ""} onChange={(e) => setFormData({ ...formData, [formKey]: e.target.value ? parseInt(e.target.value) : null })} />
        </div>
      );
    }
    return (
      <div key={field.id} className="grid gap-2">
        <Label>{field.field_label}</Label>
        <Input value={formData[formKey] || ""} onChange={(e) => setFormData({ ...formData, [formKey]: e.target.value || null })} />
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
          <div className="grid grid-cols-2 gap-4 py-6">
            <button onClick={() => handleSelectType("levend")} className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-border bg-card hover:border-primary hover:bg-accent transition-all group">
              <div className="h-14 w-14 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                <Leaf className="h-7 w-7 text-emerald-600" />
              </div>
              <div className="text-center"><p className="font-semibold">Levend</p><p className="text-xs text-muted-foreground mt-1">Planten, bloemen, etc.</p></div>
            </button>
            <button onClick={() => handleSelectType("dood")} className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-border bg-card hover:border-primary hover:bg-accent transition-all group">
              <div className="h-14 w-14 rounded-full bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                <Box className="h-7 w-7 text-amber-600" />
              </div>
              <div className="text-center"><p className="font-semibold">Dood</p><p className="text-xs text-muted-foreground mt-1">Potjes, vaasjes, etc.</p></div>
            </button>
          </div>
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
            {productCategory === "levend" ? (<><Leaf className="h-5 w-5 text-emerald-600" /> Levend Product</>) : (<><Box className="h-5 w-5 text-amber-600" /> Dood Product</>)}
          </DialogTitle>
          <DialogDescription>Vul de gegevens in om een nieuw product toe te voegen.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
            {categoryFields.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">{productCategory === "levend" ? "Plant eigenschappen" : "Product eigenschappen"}</Label>
                <div className="grid grid-cols-2 gap-4">{categoryFields.map(renderField)}</div>
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="product">Productnaam *</Label>
              <Input id="product" placeholder={productCategory === "levend" ? "bijv. Rode Tulpen" : "bijv. Terracotta pot 12cm"} value={formData.product} onChange={(e) => setFormData({ ...formData, product: e.target.value })} required />
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
