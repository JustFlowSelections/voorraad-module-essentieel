export declare const ICON_MAP: Record<string, React.ComponentType<{
    className?: string;
}>>;
interface IconPickerProps {
    value: string | null;
    onChange: (iconName: string) => void;
}
export declare function IconPicker({ value, onChange }: IconPickerProps): import("react/jsx-runtime").JSX.Element;
/** Render an icon by its stored name. Falls back to Tag. */
export declare function DynamicIcon({ name, className }: {
    name: string | null;
    className?: string;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=icon-picker.d.ts.map