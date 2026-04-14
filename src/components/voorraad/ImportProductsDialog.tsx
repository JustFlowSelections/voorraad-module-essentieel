import { useState, useCallback } from "react";
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
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, Loader2, Leaf, Box } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { supabase } from "@/integrations/supabase/client";

interface ImportProductsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete: () => void;
}

interface ColumnMapping {
  product: string; batch: string; location: string; quantity: string; minQuantity: string;
  unit: string; barcode: string; purchasePrice: string; salePrice: string;
  plantType: string; potSize: string; color: string; shade: string;
  vbnCode: string; piecesPerTray: string; plantHeight: string; qualityGroup: string; imageUrl: string;
}

const FIELD_LABELS: Record<keyof ColumnMapping, { label: string; required: boolean }> = {
  product: { label: "Productnaam", required: true }, batch: { label: "Partijnummer", required: true },
  location: { label: "Locatie", required: true }, quantity: { label: "Aantal", required: false },
  minQuantity: { label: "Minimum voorraad", required: false }, unit: { label: "Eenheid", required: false },
  barcode: { label: "Barcode", required: false }, purchasePrice: { label: "Inkoopprijs", required: false },
  salePrice: { label: "Verkoopprijs", required: false }, plantType: { label: "Plantsoort", required: false },
  potSize: { label: "Potmaat", required: false }, color: { label: "Kleur", required: false },
  shade: { label: "Tint", required: false }, vbnCode: { label: "VBN code", required: false },
  piecesPerTray: { label: "Stuks per tray", required: false }, plantHeight: { label: "Planthoogte", required: false },
  qualityGroup: { label: "Kwaliteitsgroep", required: false }, imageUrl: { label: "Foto URL", required: false },
};

const AUTO_MAP: Record<string, keyof ColumnMapping> = {
  product: "product", productnaam: "product", naam: "product", name: "product",
  batch: "batch", partij: "batch", partijnummer: "batch",
  locatie: "location", location: "location", kas: "location",
  aantal: "quantity", quantity: "quantity", hoeveelheid: "quantity",
  minimum: "minQuantity", min: "minQuantity",
  eenheid: "unit", unit: "unit", barcode: "barcode", ean: "barcode",
  inkoopprijs: "purchasePrice", inkoop: "purchasePrice",
  verkoopprijs: "salePrice", verkoop: "salePrice",
  plantsoort: "plantType", soort: "plantType",
  potmaat: "potSize", pot: "potSize",
  kleur: "color", color: "color", tint: "shade", shade: "shade",
  "vbn code": "vbnCode", vbn: "vbnCode", vbncode: "vbnCode",
  "stuks per tray": "piecesPerTray", tray: "piecesPerTray",
  planthoogte: "plantHeight", hoogte: "plantHeight",
  kwaliteitsgroep: "qualityGroup", kwaliteit: "qualityGroup",
  "foto url": "imageUrl", foto: "imageUrl", afbeelding: "imageUrl",
};

const EMPTY_MAPPING: ColumnMapping = {
  product: "", batch: "", location: "", quantity: "", minQuantity: "", unit: "",
  barcode: "", purchasePrice: "", salePrice: "", plantType: "", potSize: "",
  color: "", shade: "", vbnCode: "", piecesPerTray: "", plantHeight: "", qualityGroup: "", imageUrl: "",
};

export function ImportProductsDialog({ open, onOpenChange, onImportComplete }: ImportProductsDialogProps) {
  const [step, setStep] = useState<"type" | "upload" | "map" | "preview" | "importing">("type");
  const [productType, setProductType] = useState<"levend" | "dood" | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [mapping, setMapping] = useState<ColumnMapping>(EMPTY_MAPPING);
  const [importResult, setImportResult] = useState<{ success: number; errors: number; lastError?: string } | null>(null);
  const [fileName, setFileName] = useState("");

  const reset = () => { setStep("type"); setProductType(null); setHeaders([]); setRows([]); setMapping(EMPTY_MAPPING); setImportResult(null); setFileName(""); };
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
        const autoMapping = { ...EMPTY_MAPPING };
        fileHeaders.forEach((header) => {
          const field = AUTO_MAP[header.toLowerCase().trim()];
          if (field) autoMapping[field] = header;
        });
        setMapping(autoMapping);
        setStep("map");
      } catch { toast.error("Kan het bestand niet lezen."); }
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); const file = e.dataTransfer.files[0]; if (file) handleFile(file); }, [handleFile]);
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) handleFile(file); };

  const mappedRows = rows.map((row) => ({
    product: row[mapping.product] || "", batch: row[mapping.batch] || "", location: row[mapping.location] || "",
    quantity: parseInt(row[mapping.quantity]) || 0, min_quantity: parseInt(row[mapping.minQuantity]) || 0,
    unit: row[mapping.unit] || "stuks", barcode: row[mapping.barcode] || null,
    purchase_price: parseFloat(String(row[mapping.purchasePrice]).replace(",", ".")) || 0,
    sale_price: parseFloat(String(row[mapping.salePrice]).replace(",", ".")) || 0,
    plant_type: row[mapping.plantType] || null, pot_size: row[mapping.potSize] || null,
    color: row[mapping.color] || null, shade: row[mapping.shade] || null,
    vbn_code: row[mapping.vbnCode] || null,
    pieces_per_tray: mapping.piecesPerTray ? (parseInt(row[mapping.piecesPerTray]) || null) : null,
    plant_height: row[mapping.plantHeight] || null, quality_group: row[mapping.qualityGroup] || null,
    image_url: row[mapping.imageUrl] || null,
    product_type: productType === "levend" ? "levende voorraad" : "dode voorraad",
  }));

  const validRows = mappedRows.filter((r) => r.product && r.batch && r.location);
  const invalidCount = mappedRows.length - validRows.length;
  const canProceedToPreview = mapping.product && mapping.batch && mapping.location && validRows.length > 0;

  const handleImport = async () => {
    setStep("importing");
    let success = 0; let errors = 0; let lastError = "";
    for (let i = 0; i < validRows.length; i += 50) {
      const batch = validRows.slice(i, i + 50);
      const { error } = await supabase.from("products").insert(batch);
      if (error) {
        lastError = error.message;
        for (const row of batch) {
          const { error: rowError } = await supabase.from("products").insert([row]);
          if (rowError) { errors++; lastError = rowError.message; } else { success++; }
        }
      } else { success += batch.length; }
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
            {step === "type" && "Kies het type voorraad dat je wilt importeren."}
            {step === "upload" && "Upload een Excel- of CSV-bestand."}
            {step === "map" && "Koppel de kolommen aan productvelden."}
            {step === "preview" && `${validRows.length} producten klaar om te importeren.`}
            {step === "importing" && "Bezig met importeren..."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {step === "type" && (
            <div className="grid grid-cols-2 gap-4 py-6">
              <button onClick={() => { setProductType("levend"); setStep("upload"); }} className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-border bg-card hover:border-primary hover:bg-accent transition-all group">
                <div className="h-14 w-14 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20"><Leaf className="h-7 w-7 text-emerald-600" /></div>
                <div className="text-center"><p className="font-semibold">Levend</p><p className="text-xs text-muted-foreground mt-1">Planten, bloemen, etc.</p></div>
              </button>
              <button onClick={() => { setProductType("dood"); setStep("upload"); }} className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-border bg-card hover:border-primary hover:bg-accent transition-all group">
                <div className="h-14 w-14 rounded-full bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20"><Box className="h-7 w-7 text-amber-600" /></div>
                <div className="text-center"><p className="font-semibold">Dood</p><p className="text-xs text-muted-foreground mt-1">Potjes, vaasjes, etc.</p></div>
              </button>
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
              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(FIELD_LABELS) as Array<keyof ColumnMapping>).map((field) => (
                  <div key={field} className="space-y-1">
                    <Label className="text-xs">{FIELD_LABELS[field].label}{FIELD_LABELS[field].required && <span className="text-destructive ml-1">*</span>}</Label>
                    <Select value={mapping[field] || "__none__"} onValueChange={(val) => setMapping((prev) => ({ ...prev, [field]: val === "__none__" ? "" : val }))}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Niet gekoppeld" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">— Niet gekoppeld —</SelectItem>
                        {headers.map((h) => (<SelectItem key={h} value={h}>{h}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
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
          {step === "map" && <Button onClick={() => setStep("preview")} disabled={!canProceedToPreview}>Verder naar preview</Button>}
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
