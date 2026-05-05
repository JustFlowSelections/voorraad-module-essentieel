import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@flowselections/core";
import { Button } from "@flowselections/core";
import { Switch } from "@flowselections/core";
import { Input } from "@flowselections/core";
import { Label } from "@flowselections/core";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@flowselections/core";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@flowselections/core";
import { Loader2, Package, Plus, Trash2, GripVertical, List } from "lucide-react";
import { DynamicIcon } from "../ui/icon-picker";
import { supabase } from "@flowselections/core";
import { toast } from "sonner";
import { FieldOptionsDialog } from "./FieldOptionsDialog";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy, } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
const REQUIRED_FIELD_KEYS = new Set(["product", "location"]);
function SortableFieldItem({ field, categorySlug, onToggle, onDelete, onOpenOptions, }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging, } = useSortable({ id: field.id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };
    const isActive = field.active_per_category?.[categorySlug] ?? false;
    const isRequired = REQUIRED_FIELD_KEYS.has(field.field_key);
    return (_jsxs("div", { ref: setNodeRef, style: style, className: "flex items-center justify-between rounded-lg border border-border p-3 bg-background", children: [_jsxs("div", { className: "flex items-center gap-3 flex-1 min-w-0", children: [_jsx("button", { type: "button", className: "cursor-grab active:cursor-grabbing touch-none", ...attributes, ...listeners, children: _jsx(GripVertical, { className: "h-4 w-4 text-muted-foreground flex-shrink-0" }) }), _jsx(Switch, { checked: isRequired ? true : isActive, disabled: isRequired, onCheckedChange: () => onToggle(field, categorySlug) }), _jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "font-medium truncate", children: field.field_label }), field.is_custom && (_jsxs("p", { className: "text-xs text-muted-foreground", children: ["Aangepast \u00B7 ", field.field_type === "number" ? "Nummer" : field.field_type === "select" ? "Keuzelijst" : "Tekst"] }))] })] }), field.is_custom && (_jsxs("div", { className: "flex gap-1 ml-2", children: [field.field_type === "select" && (_jsx(Button, { variant: "ghost", size: "icon", onClick: () => onOpenOptions(field), title: "Keuzes beheren", children: _jsx(List, { className: "h-4 w-4" }) })), _jsx(Button, { variant: "ghost", size: "icon", onClick: () => onDelete(field), className: "text-destructive hover:text-destructive", children: _jsx(Trash2, { className: "h-4 w-4" }) })] }))] }));
}
function FieldList({ fields, categorySlug, onToggle, onDelete, onOpenOptions, onReorder, }) {
    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
    if (fields.length === 0) {
        return (_jsx("div", { className: "text-center py-6 text-muted-foreground text-sm", children: "Geen velden geconfigureerd" }));
    }
    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            onReorder(active.id, over.id);
        }
    };
    return (_jsx(DndContext, { sensors: sensors, collisionDetection: closestCenter, onDragEnd: handleDragEnd, children: _jsx(SortableContext, { items: fields.map((f) => f.id), strategy: verticalListSortingStrategy, children: _jsx("div", { className: "space-y-2 max-h-[300px] overflow-y-auto pr-1", children: fields.map((field) => (_jsx(SortableFieldItem, { field: field, categorySlug: categorySlug, onToggle: onToggle, onDelete: onDelete, onOpenOptions: onOpenOptions }, field.id))) }) }) }));
}
export function ProductFieldsCard({ refreshKey }) {
    const [fields, setFields] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newLabel, setNewLabel] = useState("");
    const [newType, setNewType] = useState("text");
    const [newAppliesTo, setNewAppliesTo] = useState("beide");
    const [optionsDialogOpen, setOptionsDialogOpen] = useState(false);
    const [selectedField, setSelectedField] = useState(null);
    const [activeTab, setActiveTab] = useState("");
    const fetchData = async () => {
        try {
            const [fieldsRes, catsRes] = await Promise.all([
                supabase.from("product_field_settings").select("*").order("sort_order"),
                supabase.from("product_categories").select("*").order("sort_order"),
            ]);
            if (fieldsRes.error)
                throw fieldsRes.error;
            if (catsRes.error)
                throw catsRes.error;
            const rawFields = (fieldsRes.data || []);
            const normalized = rawFields.map((f) => ({
                ...f,
                active_per_category: (f.active_per_category && typeof f.active_per_category === "object") ? f.active_per_category : {},
            }));
            setFields(normalized);
            const cats = catsRes.data || [];
            setCategories(cats);
            if (cats.length > 0 && !activeTab)
                setActiveTab(cats[0].slug);
        }
        catch (error) {
            console.error("Error fetching field settings:", error);
            toast.error("Fout bij ophalen van veldinstellingen");
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => { fetchData(); }, [refreshKey]);
    const handleToggle = async (field, categorySlug) => {
        const currentActive = field.active_per_category?.[categorySlug] ?? false;
        const newActive = !currentActive;
        const newPerCategory = { ...field.active_per_category, [categorySlug]: newActive };
        setFields((prev) => prev.map((f) => (f.id === field.id ? { ...f, active_per_category: newPerCategory } : f)));
        const { error } = await supabase
            .from("product_field_settings")
            .update({ active_per_category: newPerCategory, updated_at: new Date().toISOString() })
            .eq("id", field.id);
        if (error) {
            setFields((prev) => prev.map((f) => (f.id === field.id ? { ...f, active_per_category: field.active_per_category } : f)));
            toast.error("Fout bij bijwerken van veld");
        }
    };
    const handleReorder = async (activeId, overId) => {
        const oldIndex = fields.findIndex((f) => f.id === activeId);
        const newIndex = fields.findIndex((f) => f.id === overId);
        if (oldIndex === -1 || newIndex === -1)
            return;
        const reordered = arrayMove(fields, oldIndex, newIndex);
        // Assign new sort_order values
        const updated = reordered.map((f, i) => ({ ...f, sort_order: i }));
        setFields(updated);
        // Persist all changed sort_orders
        try {
            const updates = updated
                .filter((f, i) => fields[i]?.id !== f.id) // only changed positions
                .map((f) => supabase
                .from("product_field_settings")
                .update({ sort_order: f.sort_order, updated_at: new Date().toISOString() })
                .eq("id", f.id));
            // Actually update all items to be safe
            const allUpdates = updated.map((f) => supabase
                .from("product_field_settings")
                .update({ sort_order: f.sort_order, updated_at: new Date().toISOString() })
                .eq("id", f.id));
            await Promise.all(allUpdates);
        }
        catch (error) {
            toast.error("Fout bij opslaan van volgorde");
            await fetchData(); // revert
        }
    };
    const handleAddCustomField = async () => {
        if (!newLabel.trim())
            return;
        const fieldKey = `custom_${Date.now()}`;
        const maxSort = fields.reduce((max, f) => Math.max(max, f.sort_order), 0);
        const activePerCategory = {};
        for (const cat of categories) {
            if (newAppliesTo === "beide" || newAppliesTo === cat.slug) {
                activePerCategory[cat.slug] = true;
            }
            else {
                activePerCategory[cat.slug] = false;
            }
        }
        try {
            const { error } = await supabase.from("product_field_settings").insert({
                field_key: fieldKey,
                field_label: newLabel.trim(),
                field_type: newType,
                is_custom: true,
                sort_order: maxSort + 1,
                active_per_category: activePerCategory,
            });
            if (error)
                throw error;
            toast.success(`Veld "${newLabel.trim()}" toegevoegd`);
            setNewLabel("");
            setNewType("text");
            setShowAddForm(false);
            await fetchData();
        }
        catch (error) {
            console.error("Error adding custom field:", error);
            toast.error("Fout bij toevoegen van veld");
        }
    };
    const handleDeleteField = async (field) => {
        if (!confirm(`Weet u zeker dat u "${field.field_label}" wilt verwijderen?`))
            return;
        try {
            const { error } = await supabase.from("product_field_settings").delete().eq("id", field.id);
            if (error)
                throw error;
            toast.success(`Veld "${field.field_label}" verwijderd`);
            setFields((prev) => prev.filter((f) => f.id !== field.id));
        }
        catch (error) {
            toast.error("Fout bij verwijderen van veld");
        }
    };
    const handleOpenOptions = (field) => {
        setSelectedField(field);
        setOptionsDialogOpen(true);
    };
    const getFieldsForTab = (slug) => fields.filter((f) => f.active_per_category && slug in f.active_per_category);
    return (_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Package, { className: "h-5 w-5 text-primary" }), _jsx(CardTitle, { children: "Productvelden" })] }), _jsx(CardDescription, { children: "Bepaal welke gegevens u bijhoudt per productcategorie" })] }), _jsx(CardContent, { className: "space-y-4", children: loading ? (_jsx("div", { className: "flex items-center justify-center py-8", children: _jsx(Loader2, { className: "h-6 w-6 animate-spin text-muted-foreground" }) })) : (_jsxs(_Fragment, { children: [categories.length > 0 && (_jsxs(Tabs, { value: activeTab, onValueChange: (v) => { setActiveTab(v); setShowAddForm(false); }, children: [_jsx(TabsList, { className: "w-full", children: categories.map((cat) => (_jsxs(TabsTrigger, { value: cat.slug, className: "flex-1 gap-2", children: [_jsx(DynamicIcon, { name: cat.icon, className: "h-4 w-4" }), cat.name] }, cat.slug))) }), categories.map((cat) => (_jsx(TabsContent, { value: cat.slug, className: "mt-4 space-y-4", children: _jsx(FieldList, { fields: getFieldsForTab(cat.slug), categorySlug: cat.slug, onToggle: handleToggle, onDelete: handleDeleteField, onOpenOptions: handleOpenOptions, onReorder: handleReorder }) }, cat.slug)))] })), showAddForm ? (_jsxs("div", { className: "space-y-3 rounded-lg border border-border p-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Veldnaam" }), _jsx(Input, { value: newLabel, onChange: (e) => setNewLabel(e.target.value), placeholder: "Bijv. Materiaal type" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Type" }), _jsxs(Select, { value: newType, onValueChange: setNewType, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "text", children: "Tekst" }), _jsx(SelectItem, { value: "number", children: "Nummer" }), _jsx(SelectItem, { value: "select", children: "Keuzelijst" })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Van toepassing op" }), _jsxs(Select, { value: newAppliesTo, onValueChange: setNewAppliesTo, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [categories.map((cat) => (_jsx(SelectItem, { value: cat.slug, children: cat.name }, cat.slug))), _jsx(SelectItem, { value: "beide", children: "Alle categorie\u00EBn" })] })] })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { onClick: handleAddCustomField, disabled: !newLabel.trim(), className: "flex-1", children: "Toevoegen" }), _jsx(Button, { variant: "outline", onClick: () => setShowAddForm(false), className: "flex-1", children: "Annuleren" })] })] })) : (_jsxs(Button, { variant: "outline", className: "w-full", onClick: () => {
                                setNewAppliesTo(activeTab || "beide");
                                setShowAddForm(true);
                            }, children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Veld Toevoegen"] }))] })) }), _jsx(FieldOptionsDialog, { open: optionsDialogOpen, onOpenChange: setOptionsDialogOpen, fieldId: selectedField?.id ?? null, fieldLabel: selectedField?.field_label ?? "" })] }));
}
