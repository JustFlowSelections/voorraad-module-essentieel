import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@flowselections/core";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@flowselections/core";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@flowselections/core";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@flowselections/core";
import { Label } from "@flowselections/core";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { DynamicIcon } from "../ui/icon-picker";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { supabase } from "@flowselections/core";
import { getCategoryBgClass, getCategoryIconClass } from "../../lib/categoryColors";
import { useProductFieldSettings } from "../../hooks/useProductFieldSettings";
const STANDARD_FIELD_MAP = {
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
const AUTO_MAP = {
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
export function ImportProductsDialog({ open, onOpenChange, onImportComplete }) {
    const [step, setStep] = useState("type");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [rows, setRows] = useState([]);
    const [mapping, setMapping] = useState({});
    const [importResult, setImportResult] = useState(null);
    const [fileName, setFileName] = useState("");
    const { fields, loading: fieldsLoading } = useProductFieldSettings(selectedCategory);
    useEffect(() => {
        if (open) {
            supabase.from("product_categories").select("*").order("sort_order").then(({ data }) => {
                setCategories(data || []);
            });
        }
    }, [open]);
    const reset = () => {
        setStep("type");
        setSelectedCategory(null);
        setHeaders([]);
        setRows([]);
        setMapping({});
        setImportResult(null);
        setFileName("");
    };
    const handleClose = (isOpen) => { if (!isOpen)
        reset(); onOpenChange(isOpen); };
    const handleFile = useCallback((file) => {
        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result);
                const workbook = XLSX.read(data, { type: "array" });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });
                if (jsonData.length === 0) {
                    toast.error("Het bestand bevat geen rijen");
                    return;
                }
                const fileHeaders = Object.keys(jsonData[0]);
                setHeaders(fileHeaders);
                setRows(jsonData);
                // Auto-map headers to field keys
                const autoMapping = {};
                fileHeaders.forEach((header) => {
                    const fieldKey = AUTO_MAP[header.toLowerCase().trim()];
                    if (fieldKey)
                        autoMapping[fieldKey] = header;
                });
                setMapping(autoMapping);
                setStep("map");
            }
            catch {
                toast.error("Kan het bestand niet lezen.");
            }
        };
        reader.readAsArrayBuffer(file);
    }, []);
    const handleDrop = useCallback((e) => { e.preventDefault(); const file = e.dataTransfer.files[0]; if (file)
        handleFile(file); }, [handleFile]);
    const handleFileInput = (e) => { const file = e.target.files?.[0]; if (file)
        handleFile(file); };
    const buildMappedRows = () => {
        return rows.map((row) => {
            const productRow = {};
            const customFields = {};
            for (const field of fields) {
                const headerCol = mapping[field.field_key];
                if (!headerCol)
                    continue;
                const value = row[headerCol];
                if (!value && value !== "0")
                    continue;
                if (field.field_key in STANDARD_FIELD_MAP) {
                    const dbCol = STANDARD_FIELD_MAP[field.field_key];
                    if (field.field_type === "number") {
                        productRow[dbCol] = parseFloat(String(value).replace(",", ".")) || 0;
                    }
                    else {
                        productRow[dbCol] = value;
                    }
                }
                else {
                    // Custom/category-specific field → custom_fields JSON
                    customFields[field.field_key] = field.field_type === "number"
                        ? (parseFloat(String(value).replace(",", ".")) || null)
                        : value;
                }
            }
            // Defaults
            if (!productRow.quantity)
                productRow.quantity = 0;
            if (!productRow.min_quantity)
                productRow.min_quantity = 0;
            if (!productRow.unit)
                productRow.unit = "stuks";
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
        let success = 0;
        let errors = 0;
        let lastError = "";
        const currentValidRows = buildMappedRows().filter((r) => r.product && r.batch && r.location);
        for (const row of currentValidRows) {
            const { error } = await supabase
                .from("products")
                .insert([row])
                .select("id")
                .single();
            if (error) {
                errors++;
                lastError = error.message;
                continue;
            }
            success++;
        }
        setImportResult({ success, errors, lastError });
        if (success > 0) {
            toast.success(`${success} producten geïmporteerd`);
            onImportComplete();
        }
        if (errors > 0) {
            toast.error(`${errors} producten konden niet worden geïmporteerd`);
        }
    };
    return (_jsx(Dialog, { open: open, onOpenChange: handleClose, children: _jsxs(DialogContent, { className: "sm:max-w-[700px] max-h-[85vh] flex flex-col", children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { className: "flex items-center gap-2", children: [_jsx(FileSpreadsheet, { className: "h-5 w-5" }), "Producten importeren"] }), _jsxs(DialogDescription, { children: [step === "type" && "Kies de categorie van producten die je wilt importeren.", step === "upload" && "Upload een Excel- of CSV-bestand.", step === "map" && "Koppel de kolommen aan productvelden.", step === "preview" && `${validRows.length} producten klaar om te importeren.`, step === "importing" && "Bezig met importeren..."] })] }), _jsxs("div", { className: "flex-1 overflow-y-auto py-4", children: [step === "type" && (_jsx("div", { className: `grid gap-4 py-6 ${categories.length <= 2 ? "grid-cols-2" : "grid-cols-3"}`, children: categories.map((cat) => (_jsxs("button", { onClick: () => { setSelectedCategory(cat.slug); setStep("upload"); }, className: "flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-border bg-card hover:border-primary hover:bg-accent transition-all group", children: [_jsx("div", { className: `h-14 w-14 rounded-full flex items-center justify-center transition-colors ${getCategoryBgClass(cat.color)}`, children: _jsx(DynamicIcon, { name: cat.icon, className: `h-7 w-7 ${getCategoryIconClass(cat.color)}` }) }), _jsx("div", { className: "text-center", children: _jsx("p", { className: "font-semibold", children: cat.name }) })] }, cat.slug))) })), step === "upload" && (_jsxs("div", { onDrop: handleDrop, onDragOver: (e) => e.preventDefault(), className: "border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer", onClick: () => document.getElementById("excel-file-input")?.click(), children: [_jsx(Upload, { className: "h-10 w-10 mx-auto mb-4 text-muted-foreground" }), _jsx("p", { className: "text-sm font-medium mb-1", children: "Sleep je bestand hierheen" }), _jsx("p", { className: "text-xs text-muted-foreground mb-4", children: "of klik om een bestand te selecteren" }), _jsx("p", { className: "text-xs text-muted-foreground", children: ".xlsx, .xls, .csv" }), _jsx("input", { id: "excel-file-input", type: "file", accept: ".xlsx,.xls,.csv", onChange: handleFileInput, className: "hidden" })] })), step === "map" && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground mb-2", children: [_jsx(FileSpreadsheet, { className: "h-4 w-4" }), _jsxs("span", { children: [fileName, " \u2014 ", rows.length, " rijen"] })] }), fieldsLoading ? (_jsx("div", { className: "flex justify-center py-8", children: _jsx(Loader2, { className: "h-6 w-6 animate-spin text-muted-foreground" }) })) : (_jsx("div", { className: "grid grid-cols-2 gap-3", children: fields.map((field) => (_jsxs("div", { className: "space-y-1", children: [_jsxs(Label, { className: "text-xs", children: [field.field_label, REQUIRED_FIELDS.has(field.field_key) && _jsx("span", { className: "text-destructive ml-1", children: "*" })] }), _jsxs(Select, { value: mapping[field.field_key] || "__none__", onValueChange: (val) => setMapping((prev) => ({ ...prev, [field.field_key]: val === "__none__" ? "" : val })), children: [_jsx(SelectTrigger, { className: "h-8 text-xs", children: _jsx(SelectValue, { placeholder: "Niet gekoppeld" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "__none__", children: "\u2014 Niet gekoppeld \u2014" }), headers.map((h) => (_jsx(SelectItem, { value: h, children: h }, h)))] })] })] }, field.id))) }))] })), step === "preview" && (_jsxs("div", { className: "space-y-3", children: [invalidCount > 0 && (_jsxs("div", { className: "flex items-center gap-2 text-sm text-warning bg-warning/10 rounded-md px-3 py-2", children: [_jsx(AlertCircle, { className: "h-4 w-4 shrink-0" }), _jsxs("span", { children: [invalidCount, " rijen worden overgeslagen"] })] })), _jsxs("div", { className: "border rounded-lg overflow-auto max-h-[40vh]", children: [_jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { className: "text-xs", children: "Product" }), _jsx(TableHead, { className: "text-xs", children: "Partij" }), _jsx(TableHead, { className: "text-xs", children: "Locatie" }), _jsx(TableHead, { className: "text-xs text-right", children: "Aantal" }), _jsx(TableHead, { className: "text-xs text-right", children: "Min." }), _jsx(TableHead, { className: "text-xs", children: "Eenheid" })] }) }), _jsx(TableBody, { children: validRows.slice(0, 50).map((row, i) => (_jsxs(TableRow, { children: [_jsx(TableCell, { className: "text-xs", children: row.product }), _jsx(TableCell, { className: "text-xs", children: row.batch }), _jsx(TableCell, { className: "text-xs", children: row.location }), _jsx(TableCell, { className: "text-xs text-right", children: row.quantity }), _jsx(TableCell, { className: "text-xs text-right", children: row.min_quantity }), _jsx(TableCell, { className: "text-xs", children: row.unit })] }, i))) })] }), validRows.length > 50 && _jsxs("p", { className: "text-xs text-muted-foreground text-center py-2", children: ["... en nog ", validRows.length - 50, " producten"] })] })] })), step === "importing" && !importResult && (_jsxs("div", { className: "flex flex-col items-center justify-center py-12", children: [_jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary mb-4" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Producten importeren..." })] })), importResult && (_jsxs("div", { className: "flex flex-col items-center justify-center py-12 space-y-4", children: [_jsx(CheckCircle2, { className: "h-12 w-12 text-success" }), _jsxs("div", { className: "text-center", children: [_jsxs("p", { className: "font-semibold", children: [importResult.success, " producten ge\u00EFmporteerd"] }), importResult.errors > 0 && _jsxs("p", { className: "text-sm text-destructive", children: [importResult.errors, " fouten"] })] })] }))] }), _jsxs(DialogFooter, { children: [step === "upload" && _jsx(Button, { variant: "outline", onClick: () => setStep("type"), children: "Terug" }), step === "map" && (_jsxs(_Fragment, { children: [_jsx(Button, { variant: "outline", onClick: () => setStep("upload"), children: "Terug" }), _jsx(Button, { onClick: () => setStep("preview"), disabled: !canProceedToPreview, children: "Verder naar preview" })] })), step === "preview" && (_jsxs(_Fragment, { children: [_jsx(Button, { variant: "outline", onClick: () => setStep("map"), children: "Terug" }), _jsxs(Button, { onClick: handleImport, children: ["Importeren (", validRows.length, ")"] })] })), importResult && _jsx(Button, { onClick: () => handleClose(false), children: "Sluiten" })] })] }) }));
}
