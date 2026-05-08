export interface NewProduct {
    product: string;
    batch: string;
    location: string;
    quantity: number;
    minQuantity: number;
    unit: string;
    barcode: string;
    purchasePrice: number;
    salePrice: number;
    plantType: string | null;
    potSize: string | null;
    color: string | null;
    shade: string | null;
    vbnCode: string | null;
    piecesPerTray: number | null;
    plantHeight: string | null;
    qualityGroup: string | null;
    productType: string;
    imageUrl: string | null;
    fullColor: string | null;
    incomingQuantity: number;
    economicQuantity: number;
    customFields: Record<string, any>;
    [key: string]: any;
}
interface AddProductDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAdd: (product: NewProduct) => void;
}
export declare function AddProductDialog({ open, onOpenChange, onAdd }: AddProductDialogProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=AddProductDialog.d.ts.map