import { useMemo } from "react";
import { ChevronRight, Folder, FolderOpen, Package, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { InventoryItem } from "@/contexts/InventoryContext";

export type HierarchyLevel = string;

export interface BreadcrumbItem {
  level: HierarchyLevel;
  value: string | null;
  label: string;
}

export type ColumnKey = "quantity" | "minQuantity" | "reservedQuantity" | "availableQuantity" | "incomingQuantity" | "economicQuantity";

export const ALL_COLUMNS: { key: ColumnKey; label: string; color?: string }[] = [
  { key: "quantity", label: "Liggend" },
  { key: "minQuantity", label: "Min.", color: "text-muted-foreground" },
  { key: "reservedQuantity", label: "Geresrv.", color: "text-warning" },
  { key: "availableQuantity", label: "Beschikb.", color: "text-success" },
  { key: "incomingQuantity", label: "Inkomend", color: "text-primary" },
  { key: "economicQuantity", label: "Econom." },
];

interface FolderBrowserProps {
  inventory: InventoryItem[];
  currentPath: BreadcrumbItem[];
  onNavigate: (path: BreadcrumbItem[]) => void;
  onProductClick: (product: InventoryItem) => void;
  viewMode?: "grid" | "list";
  hierarchyLevels?: HierarchyLevel[];
  visibleColumns?: ColumnKey[];
}

interface FolderItem {
  name: string;
  count: number;
  hasLowStock: boolean;
}

function ProductListHeader({ visibleColumns }: { visibleColumns: ColumnKey[] }) {
  const cols = ALL_COLUMNS.filter((c) => visibleColumns.includes(c.key));
  return (
    <div className="flex items-center w-full px-3 py-2 text-xs text-muted-foreground border-b border-border font-medium">
      <div className="w-5 flex-shrink-0 mr-2" />
      <p className="min-w-0" style={{ width: "200px", flexShrink: 0 }}>Product</p>
      <div className="flex-1" style={{ display: "grid", gridTemplateColumns: `repeat(${cols.length}, 1fr)` }}>
        {cols.map((col) => (
          <p key={col.key} className="text-left pl-3">{col.label}</p>
        ))}
      </div>
      <div className="flex-shrink-0 ml-2 w-[52px]" />
    </div>
  );
}

function ProductCard({ product, onClick, viewMode, visibleColumns }: { product: InventoryItem; onClick: (p: InventoryItem) => void; viewMode: "grid" | "list"; visibleColumns: ColumnKey[] }) {
  if (viewMode === "list") {
    const cols = ALL_COLUMNS.filter((c) => visibleColumns.includes(c.key));
    return (
      <button
        onClick={() => onClick(product)}
        className="flex items-center w-full p-3 rounded-lg border border-border bg-card hover:bg-accent hover:border-accent transition-colors text-left"
      >
        <Package className="h-5 w-5 text-muted-foreground flex-shrink-0 mr-2" />
        <p className="font-medium text-sm min-w-0 truncate" style={{ width: "200px", flexShrink: 0 }}>{product.product}</p>
        <div className="flex-1 text-sm" style={{ display: "grid", gridTemplateColumns: `repeat(${cols.length}, 1fr)` }}>
          {cols.map((col) => (
            <p key={col.key} className={`font-semibold tabular-nums pl-3 ${col.color || ""}`}>
              {product[col.key]}
            </p>
          ))}
        </div>
        <Badge
          variant={product.status === "out" ? "destructive" : product.status === "order" ? "secondary" : "default"}
          className="flex-shrink-0 ml-2 w-[52px] justify-center"
        >
          {product.status === "out" ? "Op" : product.status === "order" ? "Laag" : "OK"}
        </Badge>
      </button>
    );
  }

  return (
    <button
      onClick={() => onClick(product)}
      className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-accent hover:border-accent transition-colors text-left"
    >
      <Package className="h-8 w-8 text-muted-foreground flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{product.product}</p>
        <div className="text-sm text-muted-foreground space-y-0.5">
          <p>Totaal: {product.quantity} {product.unit}</p>
          {product.reservedQuantity > 0 && (
            <p className="text-warning">Gereserveerd: {product.reservedQuantity}</p>
          )}
          <p className="text-success">Beschikbaar: {product.availableQuantity}</p>
        </div>
      </div>
      <Badge
        variant={product.status === "out" ? "destructive" : product.status === "order" ? "secondary" : "default"}
        className="flex-shrink-0"
      >
        {product.status === "out" ? "Op" : product.status === "order" ? "Laag" : "OK"}
      </Badge>
    </button>
  );
}

/** Get the value of a hierarchy level from an inventory item, checking both direct props and customFields */
function getItemValue(item: InventoryItem, level: string): string | null {
  if (level in item) {
    const val = item[level as keyof InventoryItem];
    return val != null ? String(val) : null;
  }
  if (item.customFields && level in item.customFields) {
    const val = item.customFields[level];
    return val != null ? String(val) : null;
  }
  return null;
}

function getLevelLabel(level: HierarchyLevel | null): string {
  const labels: Record<string, string> = {
    potSize: "potmaat",
    color: "kleur",
    shade: "tint",
    plantType: "planttype",
    plantHeight: "planthoogte",
    qualityGroup: "kwaliteitsgroep",
    location: "locatie",
    productType: "producttype",
    fullColor: "volledige kleur",
  };
  return level ? labels[level] || level : "";
}

export function FolderBrowser({ inventory, currentPath, onNavigate, onProductClick, viewMode = "grid", hierarchyLevels = ["potSize", "color", "shade"], visibleColumns = ["quantity", "minQuantity", "reservedQuantity", "availableQuantity", "incomingQuantity", "economicQuantity"] }: FolderBrowserProps) {
  const allLevels: HierarchyLevel[] = ["root", ...hierarchyLevels];
  const currentLevel = currentPath[currentPath.length - 1]?.level || "root";

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      for (const crumb of currentPath) {
        if (crumb.level === "root") continue;
        const itemValue = getItemValue(item, crumb.level);
        if (itemValue !== crumb.value) return false;
      }
      return true;
    });
  }, [inventory, currentPath]);

  const getNext = (current: HierarchyLevel): HierarchyLevel | null => {
    const idx = allLevels.indexOf(current);
    if (idx === -1 || idx >= allLevels.length - 1) return null;
    return allLevels[idx + 1];
  };

  const folders = useMemo((): FolderItem[] => {
    const nextLevel = getNext(currentLevel);
    if (!nextLevel) return [];

    const folderMap = new Map<string, { count: number; hasLowStock: boolean }>();

    filteredInventory.forEach((item) => {
      const value = getItemValue(item, nextLevel);
      if (value) {
        const existing = folderMap.get(value) || { count: 0, hasLowStock: false };
        existing.count++;
        if (item.status === "order" || item.status === "out") {
          existing.hasLowStock = true;
        }
        folderMap.set(value, existing);
      }
    });

    return Array.from(folderMap.entries())
      .map(([name, data]) => ({ name, count: data.count, hasLowStock: data.hasLowStock }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [filteredInventory, currentLevel]);

  const products = useMemo(() => {
    const nextLevel = getNext(currentLevel);
    if (!nextLevel) return filteredInventory;
    return filteredInventory.filter((item) => {
      const value = getItemValue(item, nextLevel);
      return !value;
    });
  }, [filteredInventory, currentLevel]);

  const handleFolderClick = (folderName: string) => {
    const nextLevel = getNext(currentLevel);
    if (!nextLevel) return;
    onNavigate([...currentPath, { level: nextLevel, value: folderName, label: folderName }]);
  };

  const handleBreadcrumbClick = (index: number) => {
    onNavigate(currentPath.slice(0, index + 1));
  };

  const lastLevel = allLevels[allLevels.length - 1];
  const isAtProductLevel = currentLevel === lastLevel || (folders.length === 0 && products.length > 0);

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-sm flex-wrap">
        {currentPath.map((crumb, index) => (
          <div key={index} className="flex items-center gap-1">
            {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            <Button
              variant="ghost"
              size="sm"
              className={`h-7 px-2 ${index === currentPath.length - 1 ? "font-semibold" : ""}`}
              onClick={() => handleBreadcrumbClick(index)}
            >
              {index === 0 ? <Home className="h-4 w-4 mr-1" /> : null}
              {crumb.label}
            </Button>
          </div>
        ))}
      </div>

      {/* Folder grid */}
      {folders.length > 0 && viewMode === "grid" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {folders.map((folder) => (
            <button
              key={folder.name}
              onClick={() => handleFolderClick(folder.name)}
              className="group flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card hover:bg-accent hover:border-accent transition-colors"
            >
              <div className="relative">
                <Folder className="h-12 w-12 text-primary group-hover:hidden" />
                <FolderOpen className="h-12 w-12 text-primary hidden group-hover:block" />
                {folder.hasLowStock && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-warning" />
                )}
              </div>
              <div className="text-center">
                <p className="font-medium text-sm truncate max-w-[120px]">{folder.name}</p>
                <p className="text-xs text-muted-foreground">{folder.count} items</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Folder list */}
      {folders.length > 0 && viewMode === "list" && (
        <div className="space-y-1">
          {folders.map((folder) => (
            <button
              key={folder.name}
              onClick={() => handleFolderClick(folder.name)}
              className="group flex items-center gap-3 w-full p-3 rounded-lg border border-border bg-card hover:bg-accent hover:border-accent transition-colors text-left"
            >
              <div className="relative">
                <Folder className="h-6 w-6 text-primary group-hover:hidden" />
                <FolderOpen className="h-6 w-6 text-primary hidden group-hover:block" />
                {folder.hasLowStock && (
                  <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-warning" />
                )}
              </div>
              <p className="font-medium text-sm flex-1">{folder.name}</p>
              <span className="text-xs text-muted-foreground">{folder.count} items</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      )}

      {/* Products */}
      {products.length > 0 && (
        <div className="space-y-2">
          {folders.length > 0 && (
            <h4 className="text-sm font-medium text-muted-foreground">Producten zonder {getLevelLabel(getNext(currentLevel))}</h4>
          )}
          <div className={viewMode === "list" ? "space-y-0" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"}>
            {viewMode === "list" && <ProductListHeader visibleColumns={visibleColumns} />}
            <div className={viewMode === "list" ? "space-y-1" : "contents"}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} onClick={onProductClick} viewMode={viewMode} visibleColumns={visibleColumns} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* All products at product level */}
      {isAtProductLevel && folders.length === 0 && filteredInventory.length > 0 && products.length === 0 && (
        <div className={viewMode === "list" ? "space-y-0" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"}>
          {viewMode === "list" && <ProductListHeader visibleColumns={visibleColumns} />}
          <div className={viewMode === "list" ? "space-y-1" : "contents"}>
            {filteredInventory.map((product) => (
              <ProductCard key={product.id} product={product} onClick={onProductClick} viewMode={viewMode} visibleColumns={visibleColumns} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {filteredInventory.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Geen producten gevonden</p>
        </div>
      )}
    </div>
  );
}
