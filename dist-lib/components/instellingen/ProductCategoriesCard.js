import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@flowselections/core";
import { Button } from "@flowselections/core";
import { Input } from "@flowselections/core";
import { Tags, Plus, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@flowselections/core";
import { toast } from "sonner";
import { IconPicker, DynamicIcon } from "../ui/icon-picker";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@flowselections/core";
import { AVAILABLE_COLORS, getCategoryColor } from "../../lib/categoryColors";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@flowselections/core";
export function ProductCategoriesCard({ onCategoriesChanged }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newName, setNewName] = useState("");
    const [newIcon, setNewIcon] = useState("tag");
    const [newColor, setNewColor] = useState("blue");
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [usageCount, setUsageCount] = useState(0);
    const [checkingUsage, setCheckingUsage] = useState(false);
    const fetchCategories = async () => {
        try {
            const { data, error } = await supabase.from("product_categories").select("*").order("sort_order");
            if (error)
                throw error;
            setCategories(data || []);
        }
        catch {
            toast.error("Fout bij ophalen van categorieën");
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => { fetchCategories(); }, []);
    const handleAdd = async () => {
        if (!newName.trim())
            return;
        const slug = newName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        try {
            const { error } = await supabase.from("product_categories").insert({
                name: newName.trim(),
                slug,
                icon: newIcon,
                color: newColor,
                sort_order: categories.length,
            });
            if (error) {
                if (error.code === "23505")
                    toast.error("Deze categorie bestaat al");
                else
                    throw error;
                return;
            }
            // Add the new category slug to active_per_category for all standard (non-custom) fields
            const { data: fieldSettings } = await supabase
                .from("product_field_settings")
                .select("id, is_custom, active_per_category")
                .eq("is_custom", false);
            if (fieldSettings && fieldSettings.length > 0) {
                await Promise.all(fieldSettings.map((f) => {
                    const updated = { ...(f.active_per_category || {}), [slug]: true };
                    return supabase
                        .from("product_field_settings")
                        .update({ active_per_category: updated, updated_at: new Date().toISOString() })
                        .eq("id", f.id);
                }));
            }
            toast.success(`Categorie "${newName.trim()}" toegevoegd`);
            setNewName("");
            setNewIcon("tag");
            setNewColor("blue");
            await fetchCategories();
            onCategoriesChanged?.();
        }
        catch {
            toast.error("Fout bij toevoegen van categorie");
        }
    };
    const handleDeleteClick = async (cat) => {
        setCheckingUsage(true);
        setDeleteTarget(cat);
        try {
            // Check how many products use this category slug as product_type
            const { count, error } = await supabase
                .from("products")
                .select("id", { count: "exact", head: true })
                .eq("product_type", cat.slug);
            if (error)
                throw error;
            setUsageCount(count || 0);
        }
        catch {
            setUsageCount(0);
        }
        finally {
            setCheckingUsage(false);
        }
    };
    const confirmDelete = async () => {
        if (!deleteTarget)
            return;
        try {
            const { error } = await supabase.from("product_categories").delete().eq("id", deleteTarget.id);
            if (error)
                throw error;
            toast.success(`Categorie "${deleteTarget.name}" verwijderd`);
            setDeleteTarget(null);
            await fetchCategories();
            onCategoriesChanged?.();
        }
        catch {
            toast.error("Fout bij verwijderen van categorie");
        }
    };
    return (_jsxs(_Fragment, { children: [_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Tags, { className: "h-5 w-5 text-primary" }), _jsx(CardTitle, { children: "Productcategorie\u00EBn" })] }), _jsx(CardDescription, { children: "Beheer de typen voorraad (bijv. Levend, Dood)" })] }), _jsxs(CardContent, { className: "space-y-4", children: [loading ? (_jsx("div", { className: "flex items-center justify-center py-8", children: _jsx(Loader2, { className: "h-6 w-6 animate-spin text-muted-foreground" }) })) : categories.length === 0 ? (_jsx("div", { className: "text-center py-8 text-muted-foreground", children: "Geen categorie\u00EBn gevonden" })) : (_jsx("div", { className: "space-y-3 max-h-[280px] overflow-y-auto", children: categories.map((cat) => (_jsxs("div", { className: "flex items-center justify-between rounded-lg border border-border p-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: `h-6 w-6 rounded-full flex items-center justify-center ${getCategoryColor(cat.color).bg}`, children: _jsx(DynamicIcon, { name: cat.icon, className: `h-3.5 w-3.5 ${getCategoryColor(cat.color).icon}` }) }), _jsx("span", { className: "font-medium", children: cat.name }), _jsxs("span", { className: "text-xs text-muted-foreground", children: ["(", cat.slug, ")"] })] }), _jsx(Button, { variant: "ghost", size: "icon", onClick: () => handleDeleteClick(cat), className: "text-destructive hover:text-destructive", title: "Verwijderen", children: _jsx(Trash2, { className: "h-4 w-4" }) })] }, cat.id))) })), _jsxs("div", { className: "space-y-2", children: [_jsx(Input, { placeholder: "Nieuwe categorie naam...", value: newName, onChange: (e) => setNewName(e.target.value), onKeyDown: (e) => e.key === "Enter" && handleAdd() }), _jsxs("div", { className: "flex gap-2 items-center", children: [_jsx(IconPicker, { value: newIcon, onChange: setNewIcon }), _jsxs(Select, { value: newColor, onValueChange: setNewColor, children: [_jsx(SelectTrigger, { className: "w-[110px]", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: `h-3 w-3 rounded-full ${getCategoryColor(newColor).dot}` }), _jsx("span", { className: "capitalize text-xs", children: newColor })] }) }), _jsx(SelectContent, { children: AVAILABLE_COLORS.map((c) => (_jsx(SelectItem, { value: c, children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: `h-3 w-3 rounded-full ${getCategoryColor(c).dot}` }), _jsx("span", { className: "capitalize", children: c })] }) }, c))) })] }), _jsx("div", { className: "flex-1" }), _jsxs(Button, { variant: "outline", onClick: handleAdd, disabled: !newName.trim(), children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Toevoegen"] })] })] })] })] }), _jsx(AlertDialog, { open: !!deleteTarget, onOpenChange: (open) => !open && setDeleteTarget(null), children: _jsxs(AlertDialogContent, { children: [_jsxs(AlertDialogHeader, { children: [_jsx(AlertDialogTitle, { children: "Categorie verwijderen" }), _jsx(AlertDialogDescription, { children: checkingUsage ? (_jsxs("span", { className: "flex items-center gap-2", children: [_jsx(Loader2, { className: "h-4 w-4 animate-spin" }), " Gebruik controleren..."] })) : usageCount > 0 ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "font-semibold text-destructive", children: "Let op:" }), " De categorie \"", deleteTarget?.name, "\" wordt momenteel gebruikt door", " ", _jsxs("span", { className: "font-semibold", children: [usageCount, " product", usageCount !== 1 ? "en" : ""] }), " in de voorraad.", _jsx("br", {}), _jsx("br", {}), "Weet u zeker dat u deze categorie wilt verwijderen? De producten behouden hun huidige type, maar de categorie zal niet meer beschikbaar zijn."] })) : (_jsxs(_Fragment, { children: ["Weet u zeker dat u de categorie \"", deleteTarget?.name, "\" wilt verwijderen?"] })) })] }), _jsxs(AlertDialogFooter, { children: [_jsx(AlertDialogCancel, { children: "Annuleren" }), _jsx(AlertDialogAction, { onClick: confirmDelete, disabled: checkingUsage, className: "bg-destructive text-destructive-foreground hover:bg-destructive/90", children: "Verwijderen" })] })] }) })] }));
}
