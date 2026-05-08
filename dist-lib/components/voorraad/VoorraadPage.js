import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Header } from "@flowselections/core";
import { Button } from "@flowselections/core";
import { Input } from "@flowselections/core";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@flowselections/core";
import { Plus, Search, Filter, Download, Upload, Loader2, LayoutGrid, List, Settings2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@flowselections/core";
import { Checkbox } from "@flowselections/core";
import * as XLSX from "xlsx";
import { AddProductDialog } from "./AddProductDialog";
import { ProductDetailDialog } from "./ProductDetailDialog";
import { ImportProductsDialog } from "./ImportProductsDialog";
import { FolderBrowser, ALL_COLUMNS } from "./FolderBrowser";
import { InventoryProvider, useInventory, calculateStatus } from "../../contexts/InventoryContext";
import { supabase } from "@flowselections/core";
export function VoorraadPage() {
    return (_jsx(InventoryProvider, { children: _jsx(VoorraadPageInner, {}) }));
}
function VoorraadPageInner() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [importDialogOpen, setImportDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [folderPath, setFolderPath] = useState([
        { level: "root", value: null, label: "Voorraad" },
    ]);
    const [viewMode, setViewMode] = useState("list");
    const [hierarchyLevels, setHierarchyLevels] = useState(["potSize", "color", "shade"]);
    const [visibleColumns, setVisibleColumns] = useState(["quantity", "minQuantity", "reservedQuantity", "availableQuantity", "incomingQuantity", "economicQuantity"]);
    const [hierarchyLabels, setHierarchyLabels] = useState({});
    const { inventory, loading, addProduct, updateProduct, refreshInventory } = useInventory();
    useEffect(() => {
        (async () => {
            const [settingsRes, fieldsRes] = await Promise.all([
                supabase.from("inventory_settings").select("hierarchy_levels, visible_columns").maybeSingle(),
                supabase.from("product_field_settings").select("field_key, field_label"),
            ]);
            if (settingsRes.data?.hierarchy_levels)
                setHierarchyLevels(settingsRes.data.hierarchy_levels);
            if (settingsRes.data?.visible_columns)
                setVisibleColumns(settingsRes.data.visible_columns);
            if (fieldsRes.data) {
                const labels = {};
                fieldsRes.data.forEach((f) => { labels[f.field_key] = f.field_label; });
                setHierarchyLabels(labels);
            }
        })();
    }, []);
    const toggleColumn = async (key) => {
        const newCols = visibleColumns.includes(key) ? visibleColumns.filter((c) => c !== key) : [...visibleColumns, key];
        if (newCols.length === 0)
            return;
        setVisibleColumns(newCols);
        const { data: existing } = await supabase.from("inventory_settings").select("id").maybeSingle();
        if (existing) {
            await supabase.from("inventory_settings").update({ visible_columns: newCols, updated_at: new Date().toISOString() }).eq("id", existing.id);
        }
        else {
            await supabase.from("inventory_settings").insert({ visible_columns: newCols });
        }
    };
    const filteredInventory = inventory.filter((item) => {
        const matchesSearch = item.product.toLowerCase().includes(searchQuery.toLowerCase()) || item.batch.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || item.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    const handleAddProduct = async (newProduct) => {
        await addProduct(newProduct);
    };
    const handleProductClick = (item) => {
        setSelectedProduct(item);
        setDetailDialogOpen(true);
    };
    const handleUpdateProduct = async (updatedProduct) => {
        const productWithStatus = { ...updatedProduct, status: calculateStatus(updatedProduct.quantity, updatedProduct.minQuantity) };
        await updateProduct(productWithStatus);
        setSelectedProduct(productWithStatus);
    };
    const handleExport = () => {
        if (filteredInventory.length === 0)
            return;
        const rows = filteredInventory.map((item) => ({
            Product: item.product, Partij: item.batch, Locatie: item.location,
            "Liggende voorraad": item.quantity, Gereserveerd: item.reservedQuantity,
            Beschikbaar: item.availableQuantity, Inkomend: item.incomingQuantity,
            Economisch: item.economicQuantity, "Min. voorraad": item.minQuantity,
            Eenheid: item.unit, Status: item.status === "ok" ? "Op voorraad" : item.status === "order" ? "Bijbestellen" : "Uitverkocht",
            Barcode: item.barcode, Inkoopprijs: item.purchasePrice, Verkoopprijs: item.salePrice,
            Potmaat: item.potSize || "", Kleur: item.color || "", Tint: item.shade || "",
        }));
        const ws = XLSX.utils.json_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Voorraad");
        XLSX.writeFile(wb, `voorraad-export-${new Date().toISOString().split("T")[0]}.xlsx`);
    };
    return (_jsxs(_Fragment, { children: [_jsx(Header, { title: "Voorraadbeheer" }), _jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("div", { className: "flex flex-1 gap-4", children: [_jsxs("div", { className: "relative flex-1 max-w-md", children: [_jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), _jsx(Input, { placeholder: "Zoek op product of partijnummer...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "pl-9" })] }), _jsxs(Select, { value: statusFilter, onValueChange: setStatusFilter, children: [_jsxs(SelectTrigger, { className: "w-40", children: [_jsx(Filter, { className: "mr-2 h-4 w-4" }), _jsx(SelectValue, { placeholder: "Status" })] }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "Alle statussen" }), _jsx(SelectItem, { value: "ok", children: "Genoeg op voorraad" }), _jsx(SelectItem, { value: "order", children: "Bij bestellen" }), _jsx(SelectItem, { value: "out", children: "Voorraad op" })] })] })] }), _jsxs("div", { className: "flex gap-2 items-center", children: [_jsxs(Popover, { children: [_jsx(PopoverTrigger, { asChild: true, children: _jsx(Button, { variant: "outline", size: "icon", title: "Kolommen", children: _jsx(Settings2, { className: "h-4 w-4" }) }) }), _jsx(PopoverContent, { className: "w-48", align: "end", children: _jsxs("div", { className: "space-y-1", children: [_jsx("p", { className: "text-sm font-medium mb-2", children: "Zichtbare kolommen" }), ALL_COLUMNS.map((col) => (_jsxs("label", { className: "flex items-center gap-2 py-1 cursor-pointer", children: [_jsx(Checkbox, { checked: visibleColumns.includes(col.key), onCheckedChange: () => toggleColumn(col.key) }), _jsx("span", { className: "text-sm", children: col.label })] }, col.key)))] }) })] }), _jsxs("div", { className: "flex rounded-lg border border-border overflow-hidden", children: [_jsx("button", { onClick: () => setViewMode("grid"), className: `p-2 transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-accent text-muted-foreground"}`, title: "Tegels", children: _jsx(LayoutGrid, { className: "h-4 w-4" }) }), _jsx("button", { onClick: () => setViewMode("list"), className: `p-2 transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-accent text-muted-foreground"}`, title: "Rijen", children: _jsx(List, { className: "h-4 w-4" }) })] }), _jsxs(Button, { variant: "outline", onClick: () => setImportDialogOpen(true), children: [_jsx(Upload, { className: "mr-2 h-4 w-4" }), "Importeren"] }), _jsxs(Button, { variant: "outline", onClick: handleExport, children: [_jsx(Download, { className: "mr-2 h-4 w-4" }), "Exporteren"] }), _jsxs(Button, { onClick: () => setDialogOpen(true), children: [_jsx(Plus, { className: "mr-2 h-4 w-4" }), "Nieuw Product"] })] })] }), _jsx("div", { className: "rounded-xl border border-border bg-card shadow-sm p-6", children: loading ? (_jsx("div", { className: "flex items-center justify-center py-12", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin text-muted-foreground" }) })) : (_jsx(FolderBrowser, { inventory: filteredInventory, currentPath: folderPath, onNavigate: setFolderPath, onProductClick: handleProductClick, viewMode: viewMode, hierarchyLevels: hierarchyLevels, visibleColumns: visibleColumns, hierarchyLabels: hierarchyLabels })) }), _jsx(AddProductDialog, { open: dialogOpen, onOpenChange: setDialogOpen, onAdd: handleAddProduct }), _jsx(ProductDetailDialog, { open: detailDialogOpen, onOpenChange: setDetailDialogOpen, product: selectedProduct, onUpdate: handleUpdateProduct }), _jsx(ImportProductsDialog, { open: importDialogOpen, onOpenChange: setImportDialogOpen, onImportComplete: refreshInventory })] })] }));
}
