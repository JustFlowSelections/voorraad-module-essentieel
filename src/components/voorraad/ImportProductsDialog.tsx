import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { DynamicIcon } from "@/components/ui/icon-picker";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { supabase } from "@/integrations/supabase/client";
import { useProductFieldSettings, type FieldSetting } from "@/hooks/useProductFieldSettings";

interface ImportProductsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete: () => void;
}

interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
}

// Standard field keys that map directly to product table columns
const STANDARD_FIELD_MAP: Record<string, string> = {
  product: "product",
  location: "location",
  batch: "batch",
  quantity: "quantity",
  min_quantity: "min_quantity",
  unit: "unit",
  barcode: "barcode",
  purchase_price: "purchase_price",
  sale_price: "sale_price",
  image_url: "image_url",
};

const REQUIRED_FIELDS = new Set(["product", "batch", "location"]);

// Auto-mapping from common Dutch/English header names to field_key
const AUTO_MAP: Record<string, string> = {
  product: "product", productnaam: "product", naam: "product", name: "product",
  batch: "batch", partij: "batch", partijnummer: "batch",
  locatie: "location", location: "location", kas: "location",
  aantal: "quantity", quantity: "quantity", hoeveelheid: "quantity",
  minimum: "min_quantity", min: "min_quantity", "minimum voorraad": "min_quantity",
  eenheid: "unit", unit: "unit",
  barcode: "barcode", ean: "barcode",
  inkoopprijs: "purchase_price", inkoop: "purchase_price",
  verkoopprijs: "sale_price", verkoop: "sale_price",
  plantsoort: "plant_type", soort: "plant_type",
  potmaat: "pot_size", pot: "pot_size",
  kleur: "color", color: "color",
  tint: "shade", shade: "shade",
  "vbn code": "vbn_code", vbn: "vbn_code", vbncode: "vbn_code",
  "stuks per tray": "pieces_per_tray", tray: "pieces_per_tray",
  planthoogte: "plant_height", hoogte: "plant_height",
  kwaliteitsgroep: "quality_group", kwaliteit: "quality_group",
  "foto url": "image_url", foto: "image_url", afbeelding: "image_url",
  "volle kleur": "full_color",
};

export function ImportProductsDialog({ open, onOpenChange, onImportComplete }: ImportProductsDialogProps) {
  const [step, setStep] = useState<"type" | "upload" | "map" | "preview" | "importing">("type");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [importResult, setImportResult] = useState<{ success: number; errors: number; lastError?: string } | null>(null);
  const [fileName, setFileName] = useState("");

  const { fields, loading: fieldsLoading } = useProductFieldSettings(selectedCategory);

  useEffect(() => {
    if (open) {
      supabase.from("product_categories").select("*").order("sort_order").then(({ data }) => {
        setCategories((data as unknown as ProductCategory[]) || []);
      });
    }
  }, [open]);

  const reset = () => {
    setStep("type"); setSelectedCategory(null); setHeaders([]); setRows([]);
    setMapping({}); setImportResult(null); setFileName("");
  };
  const handleClose = (isOpen: boolean) => { if (!isOpen) reset(); onOpenChange(isOpen); };

  const handleFile = useCallback((file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, { defval: "" });
        if (jsonData.length === 0) { toast.error("Het bestand bevat geen rijen"); return; }
        const fileHeaders = Object.keys(jsonData[0]);
        setHeaders(fileHeaders);
        setRows(jsonData);

        // Auto-map headers to field keys
        const autoMapping: Record<string, string> = {};
        fileHeaders.forEach((header) => {
          const fieldKey = AUTO_MAP[header.toLowerCase().trim()];
          if (fieldKey) autoMapping[fieldKey] = header;
        });
        setMapping(autoMapping);
        setStep("map");
      } catch { toast.error("Kan het bestand niet lezen."); }
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); const file = e.dataTransfer.files[0]; if (file) handleFile(file); }, [handleFile]);
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) handleFile(file); };

  const buildMappedRows = () => {
    return rows.map((row) => {
      const productRow: Record<string, any> = {};
      const customFields: Record<string, any> = {};

      for (const field of fields) {
        const headerCol = mapping[field.field_key];
        if (!headerCol) continue;
        const value = row[headerCol];
        if (!value && value !== "0") continue;

        if (field.field_key in STANDARD_FIELD_MAP) {
          const dbCol = STANDARD_FIELD_MAP[field.field_key];
          if (field.field_type === "number") {
            productRow[dbCol] = parseFloat(String(value).replace(",", ".")) || 0;
          } else {
            productRow[dbCol] = value;
          }
        } else {
          // Custom/category-specific field → custom_fields JSON
          customFields[field.field_key] = field.field_type === "number"
            ? (parseFloat(String(value).replace(",", ".")) || null)
            : value;
        }
      }

      // Defaults
      if (!productRow.quantity) productRow.quantity = 0;
      if (!productRow.min_quantity) productRow.min_quantity = 0;
      if (!productRow.unit) productRow.unit = "stuks";
      productRow.product_type = selectedCategory || "standaard";
      productRow.custom_fields = customFields;

      return productRow;
    });
  };

  const mappedRows = step === "preview" || step === "importing" ? buildMappedRows() : [];
  const validRows = mappedRows.filter((r) => r.product && r.batch && r.location);
  const invalidCount = mappedRows.length - validRows.length;
  const canProceedToPreview = mapping.product && mapping.batch && mapping.location && rows.length > 0;

  const handleImport = async () => {
    setStep("importing");
    let success = 0; let errors = 0; let lastError = "";

    const currentValidRows = buildMappedRows().filter((r) => r.product && r.batch && r.location);

    for (const row of currentValidRows) {
      const { error } = await supabase
        .from("products")
        .insert([row] as any)
        .select("id")
        .single();

      if (error) { errors++; lastError = error.message; continue; }
      success++;
    }

    setImportResult({ success, errors, lastError });
    if (success > 0) { toast.success(`${success} producten geïmporteerd`); onImportComplete(); }
    if (errors > 0) { toast.error(`${errors} producten konden niet worden geïmporteerd`); }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><FileSpreadsheet className="h-5 w-5" />Producten importeren</DialogTitle>
          <DialogDescription>
            {step === "type" && "Kies de categorie van producten die je wilt importeren."}
            {step === "upload" && "Upload een Excel- of CSV-bestand."}
            {step === "map" && "Koppel de kolommen aan productvelden."}
            {step === "preview" && `${validRows.length} producten klaar om te importeren.`}
            {step === "importing" && "Bezig met importeren..."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {step === "type" && (
            <div className={`grid gap-4 py-6 ${categories.length <= 2 ? "grid-cols-2" : "grid-cols-3"}`}>
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => { setSelectedCategory(cat.slug); setStep("upload"); }}
                  className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-border bg-card hover:border-primary hover:bg-accent transition-all group"
                >
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20">
                    <DynamicIcon name={cat.icon} className="h-7 w-7 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">{cat.name}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {step === "upload" && (
            <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => document.getElementById("excel-file-input")?.click()}>
              <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm font-medium mb-1">Sleep je bestand hierheen</p>
              <p className="text-xs text-muted-foreground mb-4">of klik om een bestand te selecteren</p>
              <p className="text-xs text-muted-foreground">.xlsx, .xls, .csv</p>
              <input id="excel-file-input" type="file" accept=".xlsx,.xls,.csv" onChange={handleFileInput} className="hidden" />
            </div>
          )}

          {step === "map" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <FileSpreadsheet className="h-4 w-4" /><span>{fileName} — {rows.length} rijen</span>
              </div>
              {fieldsLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {fields.map((field) => (
                    <div key={field.id} className="space-y-1">
                      <Label className="text-xs">
                        {field.field_label}
                        {REQUIRED_FIELDS.has(field.field_key) && <span className="text-destructive ml-1">*</span>}
                      </Label>
                      <Select
                        value={mapping[field.field_key] || "__none__"}
                        onValueChange={(val) => setMapping((prev) => ({ ...prev, [field.field_key]: val === "__none__" ? "" : val }))}
                      >
                        <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Niet gekoppeld" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none__">— Niet gekoppeld —</SelectItem>
                          {headers.map((h) => (<SelectItem key={h} value={h}>{h}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === "preview" && (
            <div className="space-y-3">
              {invalidCount > 0 && (
                <div className="flex items-center gap-2 text-sm text-warning bg-warning/10 rounded-md px-3 py-2">
                  <AlertCircle className="h-4 w-4 shrink-0" /><span>{invalidCount} rijen worden overgeslagen</span>
                </div>
              )}
              <div className="border rounded-lg overflow-auto max-h-[40vh]">
                <Table>
                  <TableHeader><TableRow>
                    <TableHead className="text-xs">Product</TableHead><TableHead className="text-xs">Partij</TableHead>
                    <TableHead className="text-xs">Locatie</TableHead><TableHead className="text-xs text-right">Aantal</TableHead>
                    <TableHead className="text-xs text-right">Min.</TableHead><TableHead className="text-xs">Eenheid</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {validRows.slice(0, 50).map((row, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-xs">{row.product}</TableCell><TableCell className="text-xs">{row.batch}</TableCell>
                        <TableCell className="text-xs">{row.location}</TableCell><TableCell className="text-xs text-right">{row.quantity}</TableCell>
                        <TableCell className="text-xs text-right">{row.min_quantity}</TableCell><TableCell className="text-xs">{row.unit}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {validRows.length > 50 && <p className="text-xs text-muted-foreground text-center py-2">... en nog {validRows.length - 50} producten</p>}
              </div>
            </div>
          )}

          {step === "importing" && !importResult && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-sm text-muted-foreground">Producten importeren...</p>
            </div>
          )}

          {importResult && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <CheckCircle2 className="h-12 w-12 text-success" />
              <div className="text-center">
                <p className="font-semibold">{importResult.success} producten geïmporteerd</p>
                {importResult.errors > 0 && <p className="text-sm text-destructive">{importResult.errors} fouten</p>}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {step === "upload" && <Button variant="outline" onClick={() => setStep("type")}>Terug</Button>}
          {step === "map" && (
            <>
              <Button variant="outline" onClick={() => setStep("upload")}>Terug</Button>
              <Button onClick={() => setStep("preview")} disabled={!canProceedToPreview}>Verder naar preview</Button>
            </>
          )}
          {step === "preview" && (
            <>
              <Button variant="outline" onClick={() => setStep("map")}>Terug</Button>
              <Button onClick={handleImport}>Importeren ({validRows.length})</Button>
            </>
          )}
          {importResult && <Button onClick={() => handleClose(false)}>Sluiten</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
