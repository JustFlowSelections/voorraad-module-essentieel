import type { InventoryItem } from "../../contexts/InventoryContext";
export type HierarchyLevel = string;
export interface BreadcrumbItem {
    level: HierarchyLevel;
    value: string | null;
    label: string;
}
export type ColumnKey = "quantity" | "minQuantity" | "reservedQuantity" | "availableQuantity" | "incomingQuantity" | "economicQuantity";
export declare const ALL_COLUMNS: {
    key: ColumnKey;
    label: string;
    color?: string;
}[];
interface FolderBrowserProps {
    inventory: InventoryItem[];
    currentPath: BreadcrumbItem[];
    onNavigate: (path: BreadcrumbItem[]) => void;
    onProductClick: (product: InventoryItem) => void;
    viewMode?: "grid" | "list";
    hierarchyLevels?: HierarchyLevel[];
    visibleColumns?: ColumnKey[];
    hierarchyLabels?: Record<string, string>;
}
export declare function FolderBrowser({ inventory, currentPath, onNavigate, onProductClick, viewMode, hierarchyLevels, visibleColumns, hierarchyLabels }: FolderBrowserProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=FolderBrowser.d.ts.map