import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import { ChevronRight, Folder, FolderOpen, Package, Home } from "lucide-react";
import { Button } from "@flowselections/core";
import { Badge } from "@flowselections/core";
export const ALL_COLUMNS = [
    { key: "quantity", label: "Liggend" },
    { key: "minQuantity", label: "Min.", color: "text-muted-foreground" },
    { key: "reservedQuantity", label: "Geresrv.", color: "text-warning" },
    { key: "availableQuantity", label: "Beschikb.", color: "text-success" },
    { key: "incomingQuantity", label: "Inkomend", color: "text-primary" },
    { key: "economicQuantity", label: "Econom." },
];
function ProductListHeader({ visibleColumns }) {
    const cols = ALL_COLUMNS.filter((c) => visibleColumns.includes(c.key));
    return (_jsxs("div", { className: "flex items-center w-full px-3 py-2 text-xs text-muted-foreground border-b border-border font-medium", children: [_jsx("div", { className: "w-5 flex-shrink-0 mr-2" }), _jsx("p", { className: "min-w-0", style: { width: "200px", flexShrink: 0 }, children: "Product" }), _jsx("div", { className: "flex-1", style: { display: "grid", gridTemplateColumns: `repeat(${cols.length}, 1fr)` }, children: cols.map((col) => (_jsx("p", { className: "text-left pl-3", children: col.label }, col.key))) }), _jsx("div", { className: "flex-shrink-0 ml-2 w-[52px]" })] }));
}
function ProductCard({ product, onClick, viewMode, visibleColumns }) {
    if (viewMode === "list") {
        const cols = ALL_COLUMNS.filter((c) => visibleColumns.includes(c.key));
        return (_jsxs("button", { onClick: () => onClick(product), className: "flex items-center w-full p-3 rounded-lg border border-border bg-card hover:bg-accent hover:border-accent transition-colors text-left", children: [_jsx(Package, { className: "h-5 w-5 text-muted-foreground flex-shrink-0 mr-2" }), _jsx("p", { className: "font-medium text-sm min-w-0 truncate", style: { width: "200px", flexShrink: 0 }, children: product.product }), _jsx("div", { className: "flex-1 text-sm", style: { display: "grid", gridTemplateColumns: `repeat(${cols.length}, 1fr)` }, children: cols.map((col) => (_jsx("p", { className: `font-semibold tabular-nums pl-3 ${col.color || ""}`, children: product[col.key] }, col.key))) }), _jsx(Badge, { variant: product.status === "out" ? "destructive" : product.status === "order" ? "secondary" : "default", className: "flex-shrink-0 ml-2 w-[52px] justify-center", children: product.status === "out" ? "Op" : product.status === "order" ? "Laag" : "OK" })] }));
    }
    return (_jsxs("button", { onClick: () => onClick(product), className: "flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-accent hover:border-accent transition-colors text-left", children: [_jsx(Package, { className: "h-8 w-8 text-muted-foreground flex-shrink-0" }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "font-medium truncate", children: product.product }), _jsxs("div", { className: "text-sm text-muted-foreground space-y-0.5", children: [_jsxs("p", { children: ["Totaal: ", product.quantity, " ", product.unit] }), product.reservedQuantity > 0 && (_jsxs("p", { className: "text-warning", children: ["Gereserveerd: ", product.reservedQuantity] })), _jsxs("p", { className: "text-success", children: ["Beschikbaar: ", product.availableQuantity] })] })] }), _jsx(Badge, { variant: product.status === "out" ? "destructive" : product.status === "order" ? "secondary" : "default", className: "flex-shrink-0", children: product.status === "out" ? "Op" : product.status === "order" ? "Laag" : "OK" })] }));
}
/** Get the value of a hierarchy level from an inventory item, checking both direct props and customFields */
function getItemValue(item, level) {
    if (level in item) {
        const val = item[level];
        return val != null ? String(val) : null;
    }
    if (item.customFields && level in item.customFields) {
        const val = item.customFields[level];
        return val != null ? String(val) : null;
    }
    return null;
}
function getLevelLabel(level, hierarchyLabels) {
    if (!level)
        return "";
    if (hierarchyLabels && hierarchyLabels[level])
        return hierarchyLabels[level].toLowerCase();
    const labels = {
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
    return labels[level] || level;
}
export function FolderBrowser({ inventory, currentPath, onNavigate, onProductClick, viewMode = "grid", hierarchyLevels = ["potSize", "color", "shade"], visibleColumns = ["quantity", "minQuantity", "reservedQuantity", "availableQuantity", "incomingQuantity", "economicQuantity"], hierarchyLabels = {} }) {
    const allLevels = ["root", ...hierarchyLevels];
    const currentLevel = currentPath[currentPath.length - 1]?.level || "root";
    const filteredInventory = useMemo(() => {
        return inventory.filter((item) => {
            for (const crumb of currentPath) {
                if (crumb.level === "root")
                    continue;
                const itemValue = getItemValue(item, crumb.level);
                if (itemValue !== crumb.value)
                    return false;
            }
            return true;
        });
    }, [inventory, currentPath]);
    const getNext = (current) => {
        const idx = allLevels.indexOf(current);
        if (idx === -1 || idx >= allLevels.length - 1)
            return null;
        return allLevels[idx + 1];
    };
    const folders = useMemo(() => {
        const nextLevel = getNext(currentLevel);
        if (!nextLevel)
            return [];
        const folderMap = new Map();
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
        if (!nextLevel)
            return filteredInventory;
        return filteredInventory.filter((item) => {
            const value = getItemValue(item, nextLevel);
            return !value;
        });
    }, [filteredInventory, currentLevel]);
    const handleFolderClick = (folderName) => {
        const nextLevel = getNext(currentLevel);
        if (!nextLevel)
            return;
        onNavigate([...currentPath, { level: nextLevel, value: folderName, label: folderName }]);
    };
    const handleBreadcrumbClick = (index) => {
        onNavigate(currentPath.slice(0, index + 1));
    };
    const lastLevel = allLevels[allLevels.length - 1];
    const isAtProductLevel = currentLevel === lastLevel || (folders.length === 0 && products.length > 0);
    return (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "flex items-center gap-1 text-sm flex-wrap", children: currentPath.map((crumb, index) => (_jsxs("div", { className: "flex items-center gap-1", children: [index > 0 && _jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground" }), _jsxs(Button, { variant: "ghost", size: "sm", className: `h-7 px-2 ${index === currentPath.length - 1 ? "font-semibold" : ""}`, onClick: () => handleBreadcrumbClick(index), children: [index === 0 ? _jsx(Home, { className: "h-4 w-4 mr-1" }) : null, crumb.label] })] }, index))) }), folders.length > 0 && viewMode === "grid" && (_jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3", children: folders.map((folder) => (_jsxs("button", { onClick: () => handleFolderClick(folder.name), className: "group flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card hover:bg-accent hover:border-accent transition-colors", children: [_jsxs("div", { className: "relative", children: [_jsx(Folder, { className: "h-12 w-12 text-primary group-hover:hidden" }), _jsx(FolderOpen, { className: "h-12 w-12 text-primary hidden group-hover:block" }), folder.hasLowStock && (_jsx("span", { className: "absolute -top-1 -right-1 h-3 w-3 rounded-full bg-warning" }))] }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "font-medium text-sm truncate max-w-[120px]", children: folder.name }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [folder.count, " items"] })] })] }, folder.name))) })), folders.length > 0 && viewMode === "list" && (_jsx("div", { className: "space-y-1", children: folders.map((folder) => (_jsxs("button", { onClick: () => handleFolderClick(folder.name), className: "group flex items-center gap-3 w-full p-3 rounded-lg border border-border bg-card hover:bg-accent hover:border-accent transition-colors text-left", children: [_jsxs("div", { className: "relative", children: [_jsx(Folder, { className: "h-6 w-6 text-primary group-hover:hidden" }), _jsx(FolderOpen, { className: "h-6 w-6 text-primary hidden group-hover:block" }), folder.hasLowStock && (_jsx("span", { className: "absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-warning" }))] }), _jsx("p", { className: "font-medium text-sm flex-1", children: folder.name }), _jsxs("span", { className: "text-xs text-muted-foreground", children: [folder.count, " items"] }), _jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground" })] }, folder.name))) })), products.length > 0 && (_jsxs("div", { className: "space-y-2", children: [folders.length > 0 && (_jsxs("h4", { className: "text-sm font-medium text-muted-foreground", children: ["Producten zonder ", getLevelLabel(getNext(currentLevel), hierarchyLabels)] })), _jsxs("div", { className: viewMode === "list" ? "space-y-0" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", children: [viewMode === "list" && _jsx(ProductListHeader, { visibleColumns: visibleColumns }), _jsx("div", { className: viewMode === "list" ? "space-y-1" : "contents", children: products.map((product) => (_jsx(ProductCard, { product: product, onClick: onProductClick, viewMode: viewMode, visibleColumns: visibleColumns }, product.id))) })] })] })), isAtProductLevel && folders.length === 0 && filteredInventory.length > 0 && products.length === 0 && (_jsxs("div", { className: viewMode === "list" ? "space-y-0" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", children: [viewMode === "list" && _jsx(ProductListHeader, { visibleColumns: visibleColumns }), _jsx("div", { className: viewMode === "list" ? "space-y-1" : "contents", children: filteredInventory.map((product) => (_jsx(ProductCard, { product: product, onClick: onProductClick, viewMode: viewMode, visibleColumns: visibleColumns }, product.id))) })] })), filteredInventory.length === 0 && (_jsxs("div", { className: "text-center py-12 text-muted-foreground", children: [_jsx(Package, { className: "h-12 w-12 mx-auto mb-4 opacity-50" }), _jsx("p", { children: "Geen producten gevonden" })] }))] }));
}
