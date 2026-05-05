export interface FieldSetting {
    id: string;
    field_key: string;
    field_label: string;
    field_type: string;
    is_custom: boolean;
    sort_order: number;
    active_per_category: Record<string, boolean>;
}
export declare function ProductFieldsCard({ refreshKey }: {
    refreshKey?: number;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ProductFieldsCard.d.ts.map