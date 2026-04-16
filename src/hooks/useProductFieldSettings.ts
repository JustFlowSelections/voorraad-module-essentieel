import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface FieldSetting {
  id: string;
  field_key: string;
  field_label: string;
  field_type: string;
  is_custom: boolean;
  sort_order: number;
  active_per_category: Record<string, boolean>;
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
          .order("sort_order");

        if (error) throw error;

        let allFields = (data || []) as unknown as FieldSetting[];

        if (categorySlug) {
          allFields = allFields.filter((f) => {
            const perCat = f.active_per_category;
            return perCat && typeof perCat === "object" && perCat[categorySlug] === true;
          });
        }

        // Fetch options for select fields
        const selectFields = allFields.filter((f) => f.field_type === "select");
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
            allFields = allFields.map((f) => ({
              ...f,
              options: optionsMap.get(f.id) || [],
            }));
          }
        }

        setFields(allFields);
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
