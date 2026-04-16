import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface FieldSetting {
  id: string;
  field_key: string;
  field_label: string;
  field_type: string;
  is_active: boolean;
  is_custom: boolean;
  sort_order: number;
  applies_to: string;
  options?: { id: string; label: string; sort_order: number }[];
}

export function useProductFieldSettings(categorySlug?: string | null) {
  const [fields, setFields] = useState<FieldSetting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("product_field_settings")
          .select("*")
          .eq("is_active", true)
          .eq("is_custom", true)
          .order("sort_order");

        if (error) throw error;

        let filtered = (data || []) as unknown as FieldSetting[];
        if (categorySlug) {
          filtered = filtered.filter(
            (f) => f.applies_to === categorySlug || f.applies_to === "beide"
          );
        }

        // Fetch options for select fields
        const selectFields = filtered.filter((f) => f.field_type === "select");
        if (selectFields.length > 0) {
          const { data: options } = await supabase
            .from("product_field_options")
            .select("*")
            .in("field_setting_id", selectFields.map((f) => f.id))
            .order("sort_order");

          if (options) {
            const optionsMap = new Map<string, typeof options>();
            for (const opt of options) {
              const list = optionsMap.get(opt.field_setting_id) || [];
              list.push(opt);
              optionsMap.set(opt.field_setting_id, list);
            }
            filtered = filtered.map((f) => ({
              ...f,
              options: optionsMap.get(f.id) || [],
            }));
          }
        }

        setFields(filtered);
      } catch (error) {
        console.error("Error fetching field settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [categorySlug]);

  return { fields, loading };
}
