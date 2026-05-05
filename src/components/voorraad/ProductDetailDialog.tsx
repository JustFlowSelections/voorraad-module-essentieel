import { useRef, useState, useEffect } from "react";
import { Button } from "@flowselections/core";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@flowselections/core";
import { Badge } from "@flowselections/core";
import { Input } from "@flowselections/core";
import { Label } from "@flowselections/core";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@flowselections/core";
import { Download, Package, Pencil, Save, X } from "lucide-react";
import Barcode from "react-barcode";
import { InventoryItem, calculateStatus } from "../../contexts/InventoryContext";
import { useProductFieldSettings } from "../../hooks/useProductFieldSettings";

interface ProductDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: InventoryItem | null;
  onUpdate?: (updatedProduct: InventoryItem) => void;
}

const statusConfig = {
  ok: { label: "Genoeg op voorraad", variant: "default" as const },
  order: { label: "Bij bestellen", variant: "secondary" as const },
  out: { label: "Voorraad op", variant: "destructive" as const },
};

function getCategorySlug(productType: string): string | null {
  if (productType.includes("levend")) return "levend";
  if (productType.includes("dood")) return "dood";
  return null;
}

export function ProductDetailDialog({ open, onOpenChange, product, onUpdate }: ProductDetailDialogProps) {
  const barcodeRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<InventoryItem | null>(null);
  const categorySlug = product ? getCategorySlug(product.productType) : null;
  const { fields: customFields } = useProductFieldSettings(categorySlug);

  useEffect(() => {
    if (product) {
      setEditData({ ...product });
    }
    setIsEditing(false);
  }, [product]);

  if (!product || !editData) return null;

  const displayProduct = isEditing ? editData : product;
  const status = statusConfig[displayProduct.status as keyof typeof statusConfig] || statusConfig.ok;
  const barcodeValue = displayProduct.barcode || displayProduct.batch;

  const handleDownloadBarcode = () => {
    if (!barcodeRef.current) return;
    const svg = barcodeRef.current.querySelector("svg");
    if (!svg) return;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const svgRect = svg.getBoundingClientRect();
    const padding = 40;
    canvas.width = svgRect.width + padding * 2;
    canvas.height = svgRect.height + padding * 2;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, padding, padding);
      URL.revokeObjectURL(url);
      const link = document.createElement("a");
      link.download = `barcode-${displayProduct.batch}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = url;
  };

  const handleSave = () => {
    if (editData && onUpdate) {
      const newStatus = calculateStatus(editData.quantity, editData.minQuantity);
      onUpdate({ ...editData, status: newStatus });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditData({ ...product });
    setIsEditing(false);
  };

  const setCustomField = (key: string, value: any) => {
    if (!editData) return;
    setEditData({
      ...editData,
      customFields: { ...editData.customFields, [key]: value },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {isEditing ? "Product Bewerken" : displayProduct.product}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? "Pas de productgegevens aan" : "Productdetails en barcode informatie"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {isEditing ? (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Categorisatie</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2"><Label>Plantsoort</Label><Input value={editData.plantType || ""} onChange={(e) => setEditData({ ...editData, plantType: e.target.value || null })} /></div>
                  <div className="grid gap-2"><Label>Potmaat</Label><Input value={editData.potSize || ""} onChange={(e) => setEditData({ ...editData, potSize: e.target.value || null })} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2"><Label>Kleur</Label><Input value={editData.color || ""} onChange={(e) => setEditData({ ...editData, color: e.target.value || null })} /></div>
                  <div className="grid gap-2"><Label>Tint</Label><Input value={editData.shade || ""} onChange={(e) => setEditData({ ...editData, shade: e.target.value || null })} /></div>
                </div>
              </div>
              <div className="grid gap-2"><Label>Productnaam</Label><Input value={editData.product} onChange={(e) => setEditData({ ...editData, product: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2"><Label>Partijnummer</Label><Input value={editData.batch} onChange={(e) => setEditData({ ...editData, batch: e.target.value })} /></div>
                <div className="grid gap-2"><Label>Locatie</Label><Input value={editData.location} onChange={(e) => setEditData({ ...editData, location: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2"><Label>Voorraad</Label><Input type="number" min="0" value={editData.quantity} onChange={(e) => setEditData({ ...editData, quantity: parseInt(e.target.value) || 0 })} /></div>
                <div className="grid gap-2"><Label>Minimum</Label><Input type="number" min="0" value={editData.minQuantity} onChange={(e) => setEditData({ ...editData, minQuantity: parseInt(e.target.value) || 0 })} /></div>
                <div className="grid gap-2">
                  <Label>Eenheid</Label>
                  <Select value={editData.unit} onValueChange={(value) => setEditData({ ...editData, unit: value })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stuks">Stuks</SelectItem>
                      <SelectItem value="bossen">Bossen</SelectItem>
                      <SelectItem value="dozen">Dozen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2"><Label>Inkoopprijs (€)</Label><Input type="number" min="0" step="0.01" value={editData.purchasePrice} onChange={(e) => setEditData({ ...editData, purchasePrice: parseFloat(e.target.value) || 0 })} /></div>
                <div className="grid gap-2"><Label>Verkoopprijs (€)</Label><Input type="number" min="0" step="0.01" value={editData.salePrice} onChange={(e) => setEditData({ ...editData, salePrice: parseFloat(e.target.value) || 0 })} /></div>
              </div>
              <div className="grid gap-2"><Label>Barcode</Label><Input value={editData.barcode} onChange={(e) => setEditData({ ...editData, barcode: e.target.value })} className="font-mono" /></div>

              {/* Dynamic custom fields - edit mode */}
              {customFields.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Extra velden</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {customFields.map((field) => (
                      <div key={field.id} className="grid gap-2">
                        <Label>{field.field_label}</Label>
                        {field.field_type === "select" ? (
                          <Select
                            value={editData.customFields?.[field.field_key] || ""}
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
                            value={editData.customFields?.[field.field_key] || ""}
                            onChange={(e) => setCustomField(field.field_key, field.field_type === "number" ? (parseFloat(e.target.value) || "") : e.target.value)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant={status.variant}>{status.label}</Badge>
                <span className="text-sm text-muted-foreground">Type: {displayProduct.productType}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-muted-foreground">Partijnummer</p><p className="font-medium">{displayProduct.batch}</p></div>
                <div><p className="text-muted-foreground">Locatie</p><p className="font-medium">{displayProduct.location}</p></div>
                <div><p className="text-muted-foreground">Liggend</p><p className="font-medium">{displayProduct.quantity} {displayProduct.unit}</p></div>
                <div><p className="text-muted-foreground">Minimum</p><p className="font-medium">{displayProduct.minQuantity} {displayProduct.unit}</p></div>
                <div><p className="text-muted-foreground text-warning">Gereserveerd</p><p className="font-medium text-warning">{displayProduct.reservedQuantity}</p></div>
                <div><p className="text-muted-foreground text-success">Beschikbaar</p><p className="font-medium text-success">{displayProduct.availableQuantity}</p></div>
                <div><p className="text-muted-foreground text-primary">Inkomend</p><p className="font-medium text-primary">{displayProduct.incomingQuantity}</p></div>
                <div><p className="text-muted-foreground">Economisch</p><p className="font-medium">{displayProduct.economicQuantity}</p></div>
                <div><p className="text-muted-foreground">Inkoopprijs</p><p className="font-medium">€ {displayProduct.purchasePrice.toFixed(2)}</p></div>
                <div><p className="text-muted-foreground">Verkoopprijs</p><p className="font-medium">€ {displayProduct.salePrice.toFixed(2)}</p></div>
                {displayProduct.potSize && <div><p className="text-muted-foreground">Potmaat</p><p className="font-medium">{displayProduct.potSize}</p></div>}
                {displayProduct.color && <div><p className="text-muted-foreground">Kleur</p><p className="font-medium">{displayProduct.color}</p></div>}
                {displayProduct.shade && <div><p className="text-muted-foreground">Tint</p><p className="font-medium">{displayProduct.shade}</p></div>}
                {displayProduct.plantType && <div><p className="text-muted-foreground">Plantsoort</p><p className="font-medium">{displayProduct.plantType}</p></div>}
                {displayProduct.plantHeight && <div><p className="text-muted-foreground">Planthoogte</p><p className="font-medium">{displayProduct.plantHeight}</p></div>}
                {displayProduct.vbnCode && <div><p className="text-muted-foreground">VBN Code</p><p className="font-medium">{displayProduct.vbnCode}</p></div>}

                {/* Dynamic custom fields - view mode */}
                {customFields.map((field) => {
                  const value = displayProduct.customFields?.[field.field_key];
                  if (!value) return null;
                  return (
                    <div key={field.id}>
                      <p className="text-muted-foreground">{field.field_label}</p>
                      <p className="font-medium">{value}</p>
                    </div>
                  );
                })}
              </div>

              {barcodeValue && (
                <div className="border rounded-lg p-4 text-center">
                  <div ref={barcodeRef} className="flex justify-center">
                    <Barcode value={barcodeValue} width={1.5} height={60} fontSize={12} />
                  </div>
                  <Button variant="outline" size="sm" className="mt-2" onClick={handleDownloadBarcode}>
                    <Download className="h-4 w-4 mr-1" />
                    Download barcode
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}><X className="h-4 w-4 mr-1" />Annuleren</Button>
              <Button onClick={handleSave}><Save className="h-4 w-4 mr-1" />Opslaan</Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(true)}><Pencil className="h-4 w-4 mr-1" />Bewerken</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
