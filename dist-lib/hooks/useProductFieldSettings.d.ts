export interface FieldSetting {
    id: string;
    field_key: string;
    field_label: string;
    field_type: string;
    is_custom: boolean;
    sort_order: number;
    active_per_category: Record<string, boolean>;
    options?: {
        id: string;
        label: string;
        sort_order: number;
    }[];
}
export declare function useProductFieldSettings(categorySlug?: string | null): {
    fields: FieldSetting[];
    loading: boolean;
};
//# sourceMappingURL=useProductFieldSettings.d.ts.map