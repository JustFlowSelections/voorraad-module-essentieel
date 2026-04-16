import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

export const calculateStatus = (quantity: number, minQuantity: number): string => {
  if (quantity === 0) return "out";
  if (quantity < minQuantity) return "order";
  return "ok";
};

export type NewProductInput = Omit<InventoryItem, "id" | "status" | "reservedQuantity" | "availableQuantity">;

interface InventoryContextType {
  inventory: InventoryItem[];
  loading: boolean;
  addProduct: (product: NewProductInput) => Promise<void>;
  updateProduct: (product: InventoryItem) => Promise<void>;
  reduceStock: (productName: string, quantity: number) => Promise<void>;
  refreshInventory: () => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = useCallback(async () => {
    try {
      const PAGE_SIZE = 1000;
      let allProducts: any[] = [];
      let page = 0;
      let hasMore = true;

      while (hasMore) {
        const from = page * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("product")
          .range(from, to);

        if (error) throw error;

        if (data && data.length > 0) {
          allProducts = allProducts.concat(data);
          hasMore = data.length === PAGE_SIZE;
          page++;
        } else {
          hasMore = false;
        }
      }

      const items: InventoryItem[] = allProducts.map((item) => {
        const available = item.quantity;
        const cf = (item.custom_fields as Record<string, any>) || {};
        return {
          id: item.id,
          product: item.product,
          batch: item.batch,
          location: item.location,
          quantity: item.quantity,
          reservedQuantity: 0,
          availableQuantity: available,
          minQuantity: item.min_quantity,
          unit: item.unit,
          status: calculateStatus(available, item.min_quantity),
          barcode: item.barcode || "",
          purchasePrice: Number(item.purchase_price) || 0,
          salePrice: Number(item.sale_price) || 0,
          plantType: cf.plant_type || null,
          potSize: cf.pot_size || null,
          color: cf.color || null,
          shade: cf.shade || null,
          fullColor: cf.full_color || null,
          imageUrl: item.image_url || null,
          vbnCode: cf.vbn_code || null,
          piecesPerTray: cf.pieces_per_tray || null,
          plantHeight: cf.plant_height || null,
          qualityGroup: cf.quality_group || null,
          incomingQuantity: item.incoming_quantity || 0,
          economicQuantity: available + (item.incoming_quantity || 0),
          productType: (() => {
            const pt = item.product_type || "";
            if (!pt || pt === "standaard" || pt === "levend") return "levende voorraad";
            if (pt === "dood") return "dode voorraad";
            return pt;
          })(),
          customFields: cf,
        };
      });

      setInventory(items);
    } catch (error) {
      if (import.meta.env.DEV) console.error("Error fetching inventory:", error);
      toast.error("Fout bij ophalen van voorraad");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchInventory();
  }, [fetchInventory]);

  const addProduct = async (newProduct: NewProductInput) => {
    try {
      const { error: productError } = await supabase.from("products").insert({
        product: newProduct.product,
        batch: newProduct.batch,
        location: newProduct.location,
        quantity: newProduct.quantity,
        min_quantity: newProduct.minQuantity,
        unit: newProduct.unit,
        barcode: newProduct.barcode,
        purchase_price: newProduct.purchasePrice,
        sale_price: newProduct.salePrice,
        image_url: newProduct.imageUrl,
        product_type: newProduct.productType,
        custom_fields: newProduct.customFields || {},
      } as any);

      if (productError) throw productError;

      await fetchInventory();
      toast.success("Product toegevoegd");
    } catch (error) {
      if (import.meta.env.DEV) console.error("Error adding product:", error);
      toast.error("Fout bij toevoegen van product");
    }
  };

  const updateProduct = async (updatedProduct: InventoryItem) => {
    try {
      const { error: productError } = await supabase
        .from("products")
        .update({
          product: updatedProduct.product,
          batch: updatedProduct.batch,
          location: updatedProduct.location,
          quantity: updatedProduct.quantity,
          min_quantity: updatedProduct.minQuantity,
          unit: updatedProduct.unit,
          barcode: updatedProduct.barcode,
          purchase_price: updatedProduct.purchasePrice,
          sale_price: updatedProduct.salePrice,
          image_url: updatedProduct.imageUrl,
          product_type: updatedProduct.productType,
          custom_fields: updatedProduct.customFields || {},
        } as any)
        .eq("id", updatedProduct.id);

      if (productError) throw productError;

      await fetchInventory();
      toast.success("Product bijgewerkt");
    } catch (error) {
      if (import.meta.env.DEV) console.error("Error updating product:", error);
      toast.error("Fout bij bijwerken van product");
    }
  };

  const reduceStock = async (productName: string, quantity: number) => {
    try {
      const product = inventory.find((item) => item.product === productName);
      if (!product) return;

      const newQuantity = Math.max(0, product.quantity - quantity);
      const { error } = await supabase
        .from("products")
        .update({ quantity: newQuantity })
        .eq("id", product.id);

      if (error) throw error;

      setInventory((prev) =>
        prev.map((item) => {
          if (item.product === productName) {
            const newAvailable = Math.max(0, newQuantity - item.reservedQuantity);
            return {
              ...item,
              quantity: newQuantity,
              availableQuantity: newAvailable,
              status: calculateStatus(newAvailable, item.minQuantity),
            };
          }
          return item;
        })
      );
    } catch (error) {
      if (import.meta.env.DEV) console.error("Error reducing stock:", error);
      toast.error("Fout bij verminderen voorraad");
    }
  };

  const refreshInventory = async () => {
    setLoading(true);
    await fetchInventory();
  };

  return (
    <InventoryContext.Provider
      value={{ inventory, loading, addProduct, updateProduct, reduceStock, refreshInventory }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
}
