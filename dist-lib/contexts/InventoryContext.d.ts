import { ReactNode } from "react";
export interface InventoryItem {
    id: string;
    product: string;
    batch: string;
    location: string;
    quantity: number;
    reservedQuantity: number;
    availableQuantity: number;
    minQuantity: number;
    unit: string;
    status: string;
    barcode: string;
    purchasePrice: number;
    salePrice: number;
    plantType: string | null;
    potSize: string | null;
    color: string | null;
    shade: string | null;
    fullColor: string | null;
    imageUrl: string | null;
    vbnCode: string | null;
    piecesPerTray: number | null;
    plantHeight: string | null;
    qualityGroup: string | null;
    incomingQuantity: number;
    economicQuantity: number;
    productType: string;
    customFields: Record<string, any>;
}
export declare const calculateStatus: (quantity: number, minQuantity: number) => string;
export type NewProductInput = Omit<InventoryItem, "id" | "status" | "reservedQuantity" | "availableQuantity">;
interface InventoryContextType {
    inventory: InventoryItem[];
    loading: boolean;
    addProduct: (product: NewProductInput) => Promise<void>;
    updateProduct: (product: InventoryItem) => Promise<void>;
    reduceStock: (productName: string, quantity: number) => Promise<void>;
    refreshInventory: () => Promise<void>;
}
export declare function InventoryProvider({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useInventory(): InventoryContextType;
export {};
//# sourceMappingURL=InventoryContext.d.ts.map