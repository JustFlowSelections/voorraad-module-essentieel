import { InventoryItem } from "../../contexts/InventoryContext";
interface ProductDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product: InventoryItem | null;
    onUpdate?: (updatedProduct: InventoryItem) => void;
}
export declare function ProductDetailDialog({ open, onOpenChange, product, onUpdate }: ProductDetailDialogProps): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=ProductDetailDialog.d.ts.map