import { useState, useEffect } from "react";
import { Button } from "@flowselections/core";
import { Input } from "@flowselections/core";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@flowselections/core";
import { Plus, Search, Filter, Download, Upload, Loader2, LayoutGrid, List, Settings2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@flowselections/core";
import { Checkbox } from "@flowselections/core";
import * as XLSX from "xlsx";
import { AddProductDialog } from "./AddProductDialog";
import { ProductDetailDialog } from "./ProductDetailDialog";
import { ImportProductsDialog } from "./ImportProductsDialog";
import { FolderBrowser, type BreadcrumbItem, type HierarchyLevel, type ColumnKey, ALL_COLUMNS } from "./FolderBrowser";
import { InventoryProvider, useInventory, type InventoryItem, calculateStatus, type NewProductInput } from "../../contexts/InventoryContext";
import { supabase } from "@flowselections/core";

export function VoorraadPage() {
  return (
    <InventoryProvider>
      <VoorraadPageInner />
    </InventoryProvider>
  );
}

function VoorraadPageInner() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [folderPath, setFolderPath] = useState<BreadcrumbItem[]>([
    { level: "root", value: null, label: "Voorraad" },
  ]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [hierarchyLevels, setHierarchyLevels] = useState<HierarchyLevel[]>(["potSize", "color", "shade"]);
  const [visibleColumns, setVisibleColumns] = useState<ColumnKey[]>(["quantity", "minQuantity", "reservedQuantity", "availableQuantity", "incomingQuantity", "economicQuantity"]);
  const [hierarchyLabels, setHierarchyLabels] = useState<Record<string, string>>({});

  const { inventory, loading, addProduct, updateProduct, refreshInventory } = useInventory();

  useEffect(() => {
    (async () => {
      const [settingsRes, fieldsRes] = await Promise.all([
        supabase.from("inventory_settings").select("hierarchy_levels, visible_columns").maybeSingle(),
        supabase.from("product_field_settings").select("field_key, field_label"),
      ]);
      if (settingsRes.data?.hierarchy_levels) setHierarchyLevels(settingsRes.data.hierarchy_levels as HierarchyLevel[]);
      if (settingsRes.data?.visible_columns) setVisibleColumns(settingsRes.data.visible_columns as ColumnKey[]);
      if (fieldsRes.data) {
        const labels: Record<string, string> = {};
        fieldsRes.data.forEach((f) => { labels[f.field_key] = f.field_label; });
        setHierarchyLabels(labels);
      }
    })();
  }, []);

  const toggleColumn = async (key: ColumnKey) => {
    const newCols = visibleColumns.includes(key) ? visibleColumns.filter((c) => c !== key) : [...visibleColumns, key];
    if (newCols.length === 0) return;
    setVisibleColumns(newCols);
    const { data: existing } = await supabase.from("inventory_settings").select("id").maybeSingle();
    if (existing) {
      await supabase.from("inventory_settings").update({ visible_columns: newCols, updated_at: new Date().toISOString() }).eq("id", existing.id);
    } else {
      await supabase.from("inventory_settings").insert({ visible_columns: newCols });
    }
  };

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.product.toLowerCase().includes(searchQuery.toLowerCase()) || item.batch.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddProduct = async (newProduct: any) => {
    await addProduct(newProduct as NewProductInput);
  };

  const handleProductClick = (item: InventoryItem) => {
    setSelectedProduct(item);
    setDetailDialogOpen(true);
  };

  const handleUpdateProduct = async (updatedProduct: InventoryItem) => {
    const productWithStatus = { ...updatedProduct, status: calculateStatus(updatedProduct.quantity, updatedProduct.minQuantity) };
    await updateProduct(productWithStatus);
    setSelectedProduct(productWithStatus);
  };

  const handleExport = () => {
    if (filteredInventory.length === 0) return;
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

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Zoek op product of partijnummer..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle statussen</SelectItem>
                <SelectItem value="ok">Genoeg op voorraad</SelectItem>
                <SelectItem value="order">Bij bestellen</SelectItem>
                <SelectItem value="out">Voorraad op</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 items-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" title="Kolommen"><Settings2 className="h-4 w-4" /></Button>
              </PopoverTrigger>
              <PopoverContent className="w-48" align="end">
                <div className="space-y-1">
                  <p className="text-sm font-medium mb-2">Zichtbare kolommen</p>
                  {ALL_COLUMNS.map((col) => (
                    <label key={col.key} className="flex items-center gap-2 py-1 cursor-pointer">
                      <Checkbox checked={visibleColumns.includes(col.key)} onCheckedChange={() => toggleColumn(col.key)} />
                      <span className="text-sm">{col.label}</span>
                    </label>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <div className="flex rounded-lg border border-border overflow-hidden">
              <button onClick={() => setViewMode("grid")} className={`p-2 transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-accent text-muted-foreground"}`} title="Tegels">
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button onClick={() => setViewMode("list")} className={`p-2 transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-accent text-muted-foreground"}`} title="Rijen">
                <List className="h-4 w-4" />
              </button>
            </div>
            <Button variant="outline" onClick={() => setImportDialogOpen(true)}><Upload className="mr-2 h-4 w-4" />Importeren</Button>
            <Button variant="outline" onClick={handleExport}><Download className="mr-2 h-4 w-4" />Exporteren</Button>
            <Button onClick={() => setDialogOpen(true)}><Plus className="mr-2 h-4 w-4" />Nieuw Product</Button>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : (
            <FolderBrowser inventory={filteredInventory} currentPath={folderPath} onNavigate={setFolderPath} onProductClick={handleProductClick} viewMode={viewMode} hierarchyLevels={hierarchyLevels} visibleColumns={visibleColumns} hierarchyLabels={hierarchyLabels} />
          )}
        </div>

        <AddProductDialog open={dialogOpen} onOpenChange={setDialogOpen} onAdd={handleAddProduct} />
        <ProductDetailDialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen} product={selectedProduct} onUpdate={handleUpdateProduct} />
        <ImportProductsDialog open={importDialogOpen} onOpenChange={setImportDialogOpen} onImportComplete={refreshInventory} />
      </div>
    </>
  );
}

