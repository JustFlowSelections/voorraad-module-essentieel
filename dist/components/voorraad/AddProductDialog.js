import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Button } from "@flowselections/core";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@flowselections/core";
import { Input } from "@flowselections/core";
import { Label } from "@flowselections/core";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@flowselections/core";
import { RefreshCw, ArrowLeft, Loader2 } from "lucide-react";
import { DynamicIcon } from "../ui/icon-picker";
import { supabase } from "@flowselections/core";
import { useProductFieldSettings } from "../../hooks/useProductFieldSettings";
import { getCategoryBgClass, getCategoryIconClass } from "../../lib/categoryColors";
const generateBarcode = () => {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
    return `${timestamp}${random}`;
};
const defaultFormData = {
    product: "", batch: "", location: "", quantity: 0, minQuantity: 0, unit: "stuks",
    barcode: "", purchasePrice: 0, salePrice: 0, plantType: null, potSize: null,
    color: null, shade: null, vbnCode: null, piecesPerTray: null, plantHeight: null,
    qualityGroup: null, productType: "", imageUrl: null, fullColor: null,
    incomingQuantity: 0, economicQuantity: 0, customFields: {},
};
// Standard field keys that map to top-level product properties (not custom_fields)
const STANDARD_FIELD_MAP = {
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
export function AddProductDialog({ open, onOpenChange, onAdd }) {
    const [step, setStep] = useState("type");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formData, setFormData] = useState({ ...defaultFormData });
    const [locations, setLocations] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const { fields: activeFields } = useProductFieldSettings(selectedCategory);
    useEffect(() => {
        if (!open)
            return;
        setLoadingCategories(true);
        (async () => {
            const [locRes, catRes] = await Promise.all([
                supabase.from("locations").select("name").order("sort_order"),
                supabase.from("product_categories").select("id, name, slug, icon, color").order("sort_order"),
            ]);
            if (locRes.data)
                setLocations(locRes.data.map((l) => l.name));
            if (catRes.data)
                setCategories(catRes.data);
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
    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(formData);
        onOpenChange(false);
    };
    const handleSelectType = (cat) => {
        setSelectedCategory(cat.slug);
        setFormData({ ...defaultFormData, barcode: generateBarcode(), productType: cat.slug, customFields: {} });
        setStep("form");
    };
    const regenerateBarcode = () => {
        setFormData((prev) => ({ ...prev, barcode: generateBarcode() }));
    };
    const getFieldValue = (field) => {
        const standardKey = STANDARD_FIELD_MAP[field.field_key];
        if (standardKey)
            return formData[standardKey] ?? "";
        return formData.customFields[field.field_key] ?? "";
    };
    const setFieldValue = (field, value) => {
        const standardKey = STANDARD_FIELD_MAP[field.field_key];
        if (standardKey) {
            setFormData((prev) => ({ ...prev, [standardKey]: value }));
        }
        else {
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
    const renderField = (field) => {
        const isRequired = REQUIRED_KEYS.has(field.field_key);
        // Special: Location dropdown
        if (field.field_key === "location") {
            return (_jsxs("div", { className: "grid gap-2", children: [_jsxs(Label, { children: [field.field_label, " *"] }), _jsxs(Select, { value: String(getFieldValue(field)), onValueChange: (v) => setFieldValue(field, v), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Kies locatie" }) }), _jsx(SelectContent, { children: locations.length > 0 ? locations.map((loc) => (_jsx(SelectItem, { value: loc, children: loc }, loc))) : (_jsx(SelectItem, { value: "Onbekend", children: "Onbekend" })) })] })] }, field.id));
        }
        // Special: Unit dropdown
        if (field.field_key === "unit") {
            return (_jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { children: field.field_label }), _jsxs(Select, { value: String(getFieldValue(field)), onValueChange: (v) => setFieldValue(field, v), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "stuks", children: "Stuks" }), _jsx(SelectItem, { value: "bossen", children: "Bossen" }), _jsx(SelectItem, { value: "dozen", children: "Dozen" })] })] })] }, field.id));
        }
        // Special: Barcode with regenerate button
        if (field.field_key === "barcode") {
            return (_jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { children: field.field_label }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Input, { value: String(getFieldValue(field)), onChange: (e) => setFieldValue(field, e.target.value), placeholder: "Automatisch gegenereerd", className: "font-mono" }), _jsx(Button, { type: "button", variant: "outline", size: "icon", onClick: regenerateBarcode, title: "Nieuwe barcode genereren", children: _jsx(RefreshCw, { className: "h-4 w-4" }) })] })] }, field.id));
        }
        // Select-type custom field
        if (field.field_type === "select") {
            return (_jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { children: field.field_label }), _jsxs(Select, { value: String(getFieldValue(field) || ""), onValueChange: (v) => setFieldValue(field, v), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Kies..." }) }), _jsx(SelectContent, { children: (field.options || []).map((opt) => (_jsx(SelectItem, { value: opt.label, children: opt.label }, opt.id))) })] })] }, field.id));
        }
        // Number field
        if (field.field_type === "number") {
            const isPriceField = field.field_key === "purchase_price" || field.field_key === "sale_price";
            return (_jsxs("div", { className: "grid gap-2", children: [_jsxs(Label, { children: [field.field_label, isPriceField ? " (€)" : "", isRequired ? " *" : ""] }), _jsx(Input, { type: "number", min: "0", step: isPriceField ? "0.01" : "1", value: getFieldValue(field), onChange: (e) => setFieldValue(field, field.field_key === "purchase_price" || field.field_key === "sale_price" ? (parseFloat(e.target.value) || 0) : (parseInt(e.target.value) || 0)), required: isRequired, placeholder: isPriceField ? "0.00" : undefined })] }, field.id));
        }
        // Default: text field
        return (_jsxs("div", { className: "grid gap-2", children: [_jsxs(Label, { children: [field.field_label, isRequired ? " *" : ""] }), _jsx(Input, { type: "text", value: String(getFieldValue(field) || ""), onChange: (e) => setFieldValue(field, e.target.value || null), required: isRequired })] }, field.id));
    };
    if (step === "type") {
        return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: "sm:max-w-[420px]", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Nieuw Product Toevoegen" }), _jsx(DialogDescription, { children: "Kies het type voorraad dat u wilt toevoegen." })] }), loadingCategories ? (_jsx("div", { className: "flex items-center justify-center py-10", children: _jsx(Loader2, { className: "h-6 w-6 animate-spin text-muted-foreground" }) })) : categories.length === 0 ? (_jsx("div", { className: "text-center py-8 text-muted-foreground text-sm", children: "Geen categorie\u00EBn gevonden. Voeg eerst categorie\u00EBn toe via Instellingen." })) : (_jsx("div", { className: `grid gap-4 py-6 ${categories.length === 1 ? "grid-cols-1 max-w-[200px] mx-auto" : categories.length === 2 ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-3"}`, children: categories.map((cat) => (_jsxs("button", { onClick: () => handleSelectType(cat), className: "flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-border bg-card hover:border-primary hover:bg-accent transition-all group", children: [_jsx("div", { className: `h-14 w-14 rounded-full flex items-center justify-center transition-colors ${getCategoryBgClass(cat.color)}`, children: _jsx(DynamicIcon, { name: cat.icon, className: `h-7 w-7 ${getCategoryIconClass(cat.color)}` }) }), _jsx("div", { className: "text-center", children: _jsx("p", { className: "font-semibold", children: cat.name }) })] }, cat.id))) }))] }) }));
    }
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: "sm:max-w-[500px] max-h-[90vh] overflow-y-auto", children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { className: "flex items-center gap-2", children: [_jsx(Button, { variant: "ghost", size: "icon", className: "h-7 w-7", onClick: () => setStep("type"), children: _jsx(ArrowLeft, { className: "h-4 w-4" }) }), selectedCategoryName, " Product"] }), _jsx(DialogDescription, { children: "Vul de gegevens in om een nieuw product toe te voegen." })] }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2", children: [deduped.filter((f) => CORE_FIELD_KEYS.has(f.field_key)).map((field) => renderField(field)), deduped.filter((f) => !CORE_FIELD_KEYS.has(f.field_key)).length > 0 && (_jsxs("div", { className: "space-y-3 pt-2", children: [_jsx(Label, { className: "text-sm font-medium text-muted-foreground", children: "Extra velden" }), _jsx("div", { className: "grid grid-cols-2 gap-4", children: deduped.filter((f) => !CORE_FIELD_KEYS.has(f.field_key)).map((field) => renderField(field)) })] }))] }), _jsxs(DialogFooter, { children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), children: "Annuleren" }), _jsx(Button, { type: "submit", children: "Toevoegen" })] })] })] }) }));
}
