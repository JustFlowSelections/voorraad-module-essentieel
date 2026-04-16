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
          .select("*, product_plant_details(*)")
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
        const details = item.product_plant_details?.[0] || item.product_plant_details || null;
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
          plantType: details?.plant_type || null,
          potSize: details?.pot_size || null,
          color: details?.color || null,
          shade: details?.shade || null,
          fullColor: details?.full_color || null,
          imageUrl: item.image_url || null,
          vbnCode: details?.vbn_code || null,
          piecesPerTray: details?.pieces_per_tray || null,
          plantHeight: details?.plant_height || null,
          qualityGroup: details?.quality_group || null,
          incomingQuantity: item.incoming_quantity || 0,
          economicQuantity: available + (item.incoming_quantity || 0),
          productType: (() => {
            const pt = item.product_type || "";
            if (!pt || pt === "standaard" || pt === "levend") return "levende voorraad";
            if (pt === "dood") return "dode voorraad";
            return pt;
          })(),
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
      const { data: productData, error: productError } = await supabase.from("products").insert({
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
      }).select("id").single();

      if (productError) throw productError;

      const hasPlantDetails = newProduct.plantType || newProduct.potSize || newProduct.color ||
        newProduct.shade || newProduct.fullColor || newProduct.vbnCode ||
        newProduct.piecesPerTray || newProduct.plantHeight || newProduct.qualityGroup;

      if (hasPlantDetails && productData) {
        const { error: detailsError } = await supabase.from("product_plant_details").insert({
          product_id: productData.id,
          plant_type: newProduct.plantType,
          pot_size: newProduct.potSize,
          color: newProduct.color,
          shade: newProduct.shade,
          full_color: newProduct.fullColor,
          vbn_code: newProduct.vbnCode,
          pieces_per_tray: newProduct.piecesPerTray,
          plant_height: newProduct.plantHeight,
          quality_group: newProduct.qualityGroup,
        });
        if (detailsError) throw detailsError;
      }

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
        })
        .eq("id", updatedProduct.id);

      if (productError) throw productError;

      const plantDetailsData = {
        plant_type: updatedProduct.plantType,
        pot_size: updatedProduct.potSize,
        color: updatedProduct.color,
        shade: updatedProduct.shade,
        full_color: updatedProduct.fullColor,
        vbn_code: updatedProduct.vbnCode,
        pieces_per_tray: updatedProduct.piecesPerTray,
        plant_height: updatedProduct.plantHeight,
        quality_group: updatedProduct.qualityGroup,
      };

      const hasPlantDetails = Object.values(plantDetailsData).some(v => v !== null && v !== undefined);

      if (hasPlantDetails) {
        const { data: existing } = await supabase
          .from("product_plant_details")
          .select("id")
          .eq("product_id", updatedProduct.id)
          .maybeSingle();

        if (existing) {
          const { error } = await supabase
            .from("product_plant_details")
            .update(plantDetailsData)
            .eq("product_id", updatedProduct.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("product_plant_details")
            .insert({ ...plantDetailsData, product_id: updatedProduct.id });
          if (error) throw error;
        }
      }

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
