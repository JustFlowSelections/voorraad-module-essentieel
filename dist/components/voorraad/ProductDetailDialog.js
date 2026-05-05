import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useRef, useState, useEffect } from "react";
import { Button } from "@flowselections/core";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@flowselections/core";
import { Badge } from "@flowselections/core";
import { Input } from "@flowselections/core";
import { Label } from "@flowselections/core";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@flowselections/core";
import { Download, Package, Pencil, Save, X } from "lucide-react";
import Barcode from "react-barcode";
import { calculateStatus } from "../../contexts/InventoryContext";
import { useProductFieldSettings } from "../../hooks/useProductFieldSettings";
const statusConfig = {
    ok: { label: "Genoeg op voorraad", variant: "default" },
    order: { label: "Bij bestellen", variant: "secondary" },
    out: { label: "Voorraad op", variant: "destructive" },
};
function getCategorySlug(productType) {
    if (productType.includes("levend"))
        return "levend";
    if (productType.includes("dood"))
        return "dood";
    return null;
}
export function ProductDetailDialog({ open, onOpenChange, product, onUpdate }) {
    const barcodeRef = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(null);
    const categorySlug = product ? getCategorySlug(product.productType) : null;
    const { fields: customFields } = useProductFieldSettings(categorySlug);
    useEffect(() => {
        if (product) {
            setEditData({ ...product });
        }
        setIsEditing(false);
    }, [product]);
    if (!product || !editData)
        return null;
    const displayProduct = isEditing ? editData : product;
    const status = statusConfig[displayProduct.status] || statusConfig.ok;
    const barcodeValue = displayProduct.barcode || displayProduct.batch;
    const handleDownloadBarcode = () => {
        if (!barcodeRef.current)
            return;
        const svg = barcodeRef.current.querySelector("svg");
        if (!svg)
            return;
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx)
            return;
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
    const setCustomField = (key, value) => {
        if (!editData)
            return;
        setEditData({
            ...editData,
            customFields: { ...editData.customFields, [key]: value },
        });
    };
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: "sm:max-w-[500px] max-h-[90vh] overflow-y-auto", children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { className: "flex items-center gap-2", children: [_jsx(Package, { className: "h-5 w-5" }), isEditing ? "Product Bewerken" : displayProduct.product] }), _jsx(DialogDescription, { children: isEditing ? "Pas de productgegevens aan" : "Productdetails en barcode informatie" })] }), _jsx("div", { className: "space-y-6 py-4", children: isEditing ? (_jsxs("div", { className: "space-y-4 max-h-[60vh] overflow-y-auto pr-2", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { className: "text-sm font-medium text-muted-foreground", children: "Categorisatie" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { children: "Plantsoort" }), _jsx(Input, { value: editData.plantType || "", onChange: (e) => setEditData({ ...editData, plantType: e.target.value || null }) })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { children: "Potmaat" }), _jsx(Input, { value: editData.potSize || "", onChange: (e) => setEditData({ ...editData, potSize: e.target.value || null }) })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { children: "Kleur" }), _jsx(Input, { value: editData.color || "", onChange: (e) => setEditData({ ...editData, color: e.target.value || null }) })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { children: "Tint" }), _jsx(Input, { value: editData.shade || "", onChange: (e) => setEditData({ ...editData, shade: e.target.value || null }) })] })] })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { children: "Productnaam" }), _jsx(Input, { value: editData.product, onChange: (e) => setEditData({ ...editData, product: e.target.value }) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { children: "Partijnummer" }), _jsx(Input, { value: editData.batch, onChange: (e) => setEditData({ ...editData, batch: e.target.value }) })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { children: "Locatie" }), _jsx(Input, { value: editData.location, onChange: (e) => setEditData({ ...editData, location: e.target.value }) })] })] }), _jsxs("div", { className: "grid grid-cols-3 gap-4", children: [_jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { children: "Voorraad" }), _jsx(Input, { type: "number", min: "0", value: editData.quantity, onChange: (e) => setEditData({ ...editData, quantity: parseInt(e.target.value) || 0 }) })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { children: "Minimum" }), _jsx(Input, { type: "number", min: "0", value: editData.minQuantity, onChange: (e) => setEditData({ ...editData, minQuantity: parseInt(e.target.value) || 0 }) })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { children: "Eenheid" }), _jsxs(Select, { value: editData.unit, onValueChange: (value) => setEditData({ ...editData, unit: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "stuks", children: "Stuks" }), _jsx(SelectItem, { value: "bossen", children: "Bossen" }), _jsx(SelectItem, { value: "dozen", children: "Dozen" })] })] })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { children: "Inkoopprijs (\u20AC)" }), _jsx(Input, { type: "number", min: "0", step: "0.01", value: editData.purchasePrice, onChange: (e) => setEditData({ ...editData, purchasePrice: parseFloat(e.target.value) || 0 }) })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { children: "Verkoopprijs (\u20AC)" }), _jsx(Input, { type: "number", min: "0", step: "0.01", value: editData.salePrice, onChange: (e) => setEditData({ ...editData, salePrice: parseFloat(e.target.value) || 0 }) })] })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { children: "Barcode" }), _jsx(Input, { value: editData.barcode, onChange: (e) => setEditData({ ...editData, barcode: e.target.value }), className: "font-mono" })] }), customFields.length > 0 && (_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { className: "text-sm font-medium text-muted-foreground", children: "Extra velden" }), _jsx("div", { className: "grid grid-cols-2 gap-4", children: customFields.map((field) => (_jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { children: field.field_label }), field.field_type === "select" ? (_jsxs(Select, { value: editData.customFields?.[field.field_key] || "", onValueChange: (v) => setCustomField(field.field_key, v), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Kies..." }) }), _jsx(SelectContent, { children: (field.options || []).map((opt) => (_jsx(SelectItem, { value: opt.label, children: opt.label }, opt.id))) })] })) : (_jsx(Input, { type: field.field_type === "number" ? "number" : "text", value: editData.customFields?.[field.field_key] || "", onChange: (e) => setCustomField(field.field_key, field.field_type === "number" ? (parseFloat(e.target.value) || "") : e.target.value) }))] }, field.id))) })] }))] })) : (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Badge, { variant: status.variant, children: status.label }), _jsxs("span", { className: "text-sm text-muted-foreground", children: ["Type: ", displayProduct.productType] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("p", { className: "text-muted-foreground", children: "Partijnummer" }), _jsx("p", { className: "font-medium", children: displayProduct.batch })] }), _jsxs("div", { children: [_jsx("p", { className: "text-muted-foreground", children: "Locatie" }), _jsx("p", { className: "font-medium", children: displayProduct.location })] }), _jsxs("div", { children: [_jsx("p", { className: "text-muted-foreground", children: "Liggend" }), _jsxs("p", { className: "font-medium", children: [displayProduct.quantity, " ", displayProduct.unit] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-muted-foreground", children: "Minimum" }), _jsxs("p", { className: "font-medium", children: [displayProduct.minQuantity, " ", displayProduct.unit] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-muted-foreground text-warning", children: "Gereserveerd" }), _jsx("p", { className: "font-medium text-warning", children: displayProduct.reservedQuantity })] }), _jsxs("div", { children: [_jsx("p", { className: "text-muted-foreground text-success", children: "Beschikbaar" }), _jsx("p", { className: "font-medium text-success", children: displayProduct.availableQuantity })] }), _jsxs("div", { children: [_jsx("p", { className: "text-muted-foreground text-primary", children: "Inkomend" }), _jsx("p", { className: "font-medium text-primary", children: displayProduct.incomingQuantity })] }), _jsxs("div", { children: [_jsx("p", { className: "text-muted-foreground", children: "Economisch" }), _jsx("p", { className: "font-medium", children: displayProduct.economicQuantity })] }), _jsxs("div", { children: [_jsx("p", { className: "text-muted-foreground", children: "Inkoopprijs" }), _jsxs("p", { className: "font-medium", children: ["\u20AC ", displayProduct.purchasePrice.toFixed(2)] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-muted-foreground", children: "Verkoopprijs" }), _jsxs("p", { className: "font-medium", children: ["\u20AC ", displayProduct.salePrice.toFixed(2)] })] }), displayProduct.potSize && _jsxs("div", { children: [_jsx("p", { className: "text-muted-foreground", children: "Potmaat" }), _jsx("p", { className: "font-medium", children: displayProduct.potSize })] }), displayProduct.color && _jsxs("div", { children: [_jsx("p", { className: "text-muted-foreground", children: "Kleur" }), _jsx("p", { className: "font-medium", children: displayProduct.color })] }), displayProduct.shade && _jsxs("div", { children: [_jsx("p", { className: "text-muted-foreground", children: "Tint" }), _jsx("p", { className: "font-medium", children: displayProduct.shade })] }), displayProduct.plantType && _jsxs("div", { children: [_jsx("p", { className: "text-muted-foreground", children: "Plantsoort" }), _jsx("p", { className: "font-medium", children: displayProduct.plantType })] }), displayProduct.plantHeight && _jsxs("div", { children: [_jsx("p", { className: "text-muted-foreground", children: "Planthoogte" }), _jsx("p", { className: "font-medium", children: displayProduct.plantHeight })] }), displayProduct.vbnCode && _jsxs("div", { children: [_jsx("p", { className: "text-muted-foreground", children: "VBN Code" }), _jsx("p", { className: "font-medium", children: displayProduct.vbnCode })] }), customFields.map((field) => {
                                        const value = displayProduct.customFields?.[field.field_key];
                                        if (!value)
                                            return null;
                                        return (_jsxs("div", { children: [_jsx("p", { className: "text-muted-foreground", children: field.field_label }), _jsx("p", { className: "font-medium", children: value })] }, field.id));
                                    })] }), barcodeValue && (_jsxs("div", { className: "border rounded-lg p-4 text-center", children: [_jsx("div", { ref: barcodeRef, className: "flex justify-center", children: _jsx(Barcode, { value: barcodeValue, width: 1.5, height: 60, fontSize: 12 }) }), _jsxs(Button, { variant: "outline", size: "sm", className: "mt-2", onClick: handleDownloadBarcode, children: [_jsx(Download, { className: "h-4 w-4 mr-1" }), "Download barcode"] })] }))] })) }), _jsx(DialogFooter, { children: isEditing ? (_jsxs(_Fragment, { children: [_jsxs(Button, { variant: "outline", onClick: handleCancel, children: [_jsx(X, { className: "h-4 w-4 mr-1" }), "Annuleren"] }), _jsxs(Button, { onClick: handleSave, children: [_jsx(Save, { className: "h-4 w-4 mr-1" }), "Opslaan"] })] })) : (_jsxs(Button, { variant: "outline", onClick: () => setIsEditing(true), children: [_jsx(Pencil, { className: "h-4 w-4 mr-1" }), "Bewerken"] })) })] }) }));
}
