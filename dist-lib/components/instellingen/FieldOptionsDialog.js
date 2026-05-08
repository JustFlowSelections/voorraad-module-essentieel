import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@flowselections/core";
import { Button } from "@flowselections/core";
import { Input } from "@flowselections/core";
import { Loader2, Plus, Trash2, GripVertical } from "lucide-react";
import { supabase } from "@flowselections/core";
import { toast } from "sonner";
export function FieldOptionsDialog({ open, onOpenChange, fieldId, fieldLabel }) {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newOption, setNewOption] = useState("");
    const [saving, setSaving] = useState(false);
    useEffect(() => {
        if (!open || !fieldId)
            return;
        setLoading(true);
        supabase
            .from("product_field_options")
            .select("id, label, sort_order")
            .eq("field_setting_id", fieldId)
            .order("sort_order")
            .then(({ data, error }) => {
            if (error)
                console.error("Error fetching options:", error);
            else
                setOptions(data ?? []);
            setLoading(false);
        });
    }, [open, fieldId]);
    const handleAdd = async () => {
        if (!fieldId || !newOption.trim())
            return;
        setSaving(true);
        const maxSort = options.reduce((max, o) => Math.max(max, o.sort_order), -1);
        try {
            const { data, error } = await supabase
                .from("product_field_options")
                .insert({ field_setting_id: fieldId, label: newOption.trim(), sort_order: maxSort + 1 })
                .select("id, label, sort_order")
                .single();
            if (error)
                throw error;
            setOptions((prev) => [...prev, data]);
            setNewOption("");
            toast.success(`"${newOption.trim()}" toegevoegd`);
        }
        catch {
            toast.error("Fout bij toevoegen");
        }
        finally {
            setSaving(false);
        }
    };
    const handleDelete = async (option) => {
        try {
            const { error } = await supabase.from("product_field_options").delete().eq("id", option.id);
            if (error)
                throw error;
            setOptions((prev) => prev.filter((o) => o.id !== option.id));
        }
        catch {
            toast.error("Fout bij verwijderen");
        }
    };
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: "sm:max-w-md", children: [_jsx(DialogHeader, { children: _jsxs(DialogTitle, { children: ["Keuzelijst: ", fieldLabel] }) }), _jsx("div", { className: "space-y-4", children: loading ? (_jsx("div", { className: "flex items-center justify-center py-8", children: _jsx(Loader2, { className: "h-6 w-6 animate-spin text-muted-foreground" }) })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "space-y-2 max-h-[300px] overflow-y-auto pr-1", children: options.length === 0 ? (_jsx("p", { className: "text-sm text-muted-foreground text-center py-4", children: "Nog geen keuzes toegevoegd" })) : (options.map((option) => (_jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-border p-2.5", children: [_jsx(GripVertical, { className: "h-4 w-4 text-muted-foreground flex-shrink-0" }), _jsx("span", { className: "flex-1 text-sm font-medium", children: option.label }), _jsx(Button, { variant: "ghost", size: "icon", className: "h-7 w-7 text-destructive hover:text-destructive", onClick: () => handleDelete(option), children: _jsx(Trash2, { className: "h-3.5 w-3.5" }) })] }, option.id)))) }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Input, { value: newOption, onChange: (e) => setNewOption(e.target.value), placeholder: "Nieuwe keuze...", onKeyDown: (e) => e.key === "Enter" && handleAdd() }), _jsx(Button, { onClick: handleAdd, disabled: !newOption.trim() || saving, size: "sm", children: saving ? _jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : _jsx(Plus, { className: "h-4 w-4" }) })] })] })) })] }) }));
}
