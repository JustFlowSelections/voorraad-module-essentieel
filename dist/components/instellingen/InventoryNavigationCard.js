import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@flowselections/core";
import { Button } from "@flowselections/core";
import { Checkbox } from "@flowselections/core";
import { FolderTree, GripVertical, Loader2, Trash2 } from "lucide-react";
import { supabase } from "@flowselections/core";
import { toast } from "sonner";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy, } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
function SortableLevel({ levelKey, label, index, onRemove, }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging, } = useSortable({ id: levelKey });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };
    return (_jsxs("div", { ref: setNodeRef, style: style, className: "flex items-center justify-between rounded-lg border border-border p-3 bg-background", children: [_jsxs("div", { className: "flex items-center gap-3 flex-1 min-w-0", children: [_jsx("button", { type: "button", className: "cursor-grab active:cursor-grabbing touch-none", ...attributes, ...listeners, children: _jsx(GripVertical, { className: "h-4 w-4 text-muted-foreground flex-shrink-0" }) }), _jsxs("span", { className: "text-sm font-medium text-muted-foreground w-6", children: [index + 1, "."] }), _jsx("span", { className: "font-medium truncate", children: label })] }), _jsx(Button, { variant: "ghost", size: "icon", onClick: () => onRemove(levelKey), className: "text-destructive hover:text-destructive", title: "Verwijderen", children: _jsx(Trash2, { className: "h-4 w-4" }) })] }));
}
export function InventoryNavigationCard() {
    const [levels, setLevels] = useState(["potSize", "color", "shade"]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [availableLevels, setAvailableLevels] = useState([]);
    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
    useEffect(() => {
        (async () => {
            try {
                const [settingsRes, fieldsRes] = await Promise.all([
                    supabase.from("inventory_settings").select("hierarchy_levels").maybeSingle(),
                    supabase.from("product_field_settings").select("field_key, field_label").order("sort_order"),
                ]);
                if (settingsRes.data?.hierarchy_levels) {
                    setLevels(settingsRes.data.hierarchy_levels);
                }
                const fieldsFromDb = (fieldsRes.data ?? []).map((f) => ({
                    key: f.field_key,
                    label: f.field_label,
                }));
                const keys = new Set(fieldsFromDb.map((f) => f.key));
                const extras = [];
                if (!keys.has("productType"))
                    extras.push({ key: "productType", label: "Producttype" });
                if (!keys.has("location"))
                    extras.push({ key: "location", label: "Locatie" });
                const all = [...fieldsFromDb, ...extras];
                const seen = new Set();
                const deduped = all.filter((l) => { if (seen.has(l.key))
                    return false; seen.add(l.key); return true; });
                setAvailableLevels(deduped);
            }
            catch (e) {
                console.error("Error fetching hierarchy:", e);
            }
            finally {
                setLoading(false);
            }
        })();
    }, []);
    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setLevels((prev) => {
                const oldIndex = prev.indexOf(active.id);
                const newIndex = prev.indexOf(over.id);
                return arrayMove(prev, oldIndex, newIndex);
            });
        }
    };
    const handleRemove = (key) => {
        setLevels((prev) => prev.filter((l) => l !== key));
    };
    const handleSave = async () => {
        setSaving(true);
        try {
            const { data: existing } = await supabase.from("inventory_settings").select("id").maybeSingle();
            if (existing) {
                const { error } = await supabase.from("inventory_settings").update({ hierarchy_levels: levels, updated_at: new Date().toISOString() }).eq("id", existing.id);
                if (error)
                    throw error;
            }
            else {
                const { error } = await supabase.from("inventory_settings").insert({ hierarchy_levels: levels });
                if (error)
                    throw error;
            }
            toast.success("Navigatievolgorde opgeslagen");
        }
        catch {
            toast.error("Fout bij opslaan");
        }
        finally {
            setSaving(false);
        }
    };
    const getLevelLabel = (key) => availableLevels.find((l) => l.key === key)?.label ?? key;
    return (_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(FolderTree, { className: "h-5 w-5 text-primary" }), _jsx(CardTitle, { children: "Voorraad Navigatie" })] }), _jsx(CardDescription, { children: "Sleep om de mappenstructuur van de voorraad te wijzigen" })] }), _jsx(CardContent, { className: "space-y-4", children: loading ? (_jsx("div", { className: "flex items-center justify-center py-8", children: _jsx(Loader2, { className: "h-6 w-6 animate-spin text-muted-foreground" }) })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "space-y-3", children: [_jsx("div", { className: "text-xs text-muted-foreground px-1 font-medium", children: "Actieve niveaus (sleep om volgorde te wijzigen)" }), levels.length > 0 ? (_jsx(DndContext, { sensors: sensors, collisionDetection: closestCenter, onDragEnd: handleDragEnd, children: _jsx(SortableContext, { items: levels, strategy: verticalListSortingStrategy, children: _jsx("div", { className: "space-y-2", children: levels.map((level, index) => (_jsx(SortableLevel, { levelKey: level, label: getLevelLabel(level), index: index, onRemove: handleRemove }, level))) }) }) })) : null, _jsxs("div", { className: "flex items-center gap-3 rounded-lg border border-dashed border-border p-3 bg-muted/30", children: [_jsx("div", { className: "w-4" }), _jsxs("span", { className: "text-sm font-medium text-muted-foreground w-6", children: [levels.length + 1, "."] }), _jsx("span", { className: "font-medium text-muted-foreground", children: "Producten" })] })] }), availableLevels.filter((l) => !levels.includes(l.key)).length > 0 && (_jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "text-xs text-muted-foreground px-1 font-medium", children: "Beschikbare niveaus" }), _jsx("div", { className: "grid grid-cols-2 gap-2", children: availableLevels.filter((l) => !levels.includes(l.key)).map((level) => (_jsxs("label", { className: "flex items-center gap-2 rounded-lg border border-border p-3 bg-card hover:bg-accent cursor-pointer transition-colors", children: [_jsx(Checkbox, { checked: false, onCheckedChange: () => setLevels([...levels, level.key]) }), _jsx("span", { className: "text-sm", children: level.label })] }, level.key))) })] })), _jsxs(Button, { className: "w-full", onClick: handleSave, disabled: saving, children: [saving ? _jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }) : null, "Opslaan"] })] })) })] }));
}
