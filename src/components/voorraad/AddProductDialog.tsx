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
}

export function AddProductDialog({ open, onOpenChange, onAdd }: AddProductDialogProps) {
  const [step, setStep] = useState<"type" | "form">("type");
  const [productCategory, setProductCategory] = useState<"levend" | "dood" | null>(null);
  const [formData, setFormData] = useState<NewProduct>({ ...defaultFormData });
  const [locations, setLocations] = useState<string[]>([]);

  useEffect(() => {
    if (!open) return;
    (async () => {
      const { data } = await supabase.from("locations").select("name").order("sort_order");
      if (data) setLocations(data.map((l) => l.name));
    })();
  }, [open]);

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
            {productCategory === "levend" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Potmaat</Label>
                  <Input value={formData.potSize || ""} onChange={(e) => setFormData({ ...formData, potSize: e.target.value || null })} />
                </div>
                <div className="grid gap-2">
                  <Label>Kleur</Label>
                  <Input value={formData.color || ""} onChange={(e) => setFormData({ ...formData, color: e.target.value || null })} />
                </div>
                <div className="grid gap-2">
                  <Label>Tint</Label>
                  <Input value={formData.shade || ""} onChange={(e) => setFormData({ ...formData, shade: e.target.value || null })} />
                </div>
                <div className="grid gap-2">
                  <Label>Planthoogte</Label>
                  <Input value={formData.plantHeight || ""} onChange={(e) => setFormData({ ...formData, plantHeight: e.target.value || null })} />
                </div>
              </div>
            )}
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
