import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@flowselections/core";
import { Button } from "@flowselections/core";
import { Input } from "@flowselections/core";
import { Warehouse, Plus, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@flowselections/core";
import { toast } from "sonner";
export function LocationsCard() {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newName, setNewName] = useState("");
    const fetchLocations = async () => {
        try {
            const { data, error } = await supabase.from("locations").select("*").order("sort_order");
            if (error)
                throw error;
            setLocations(data || []);
        }
        catch {
            toast.error("Fout bij ophalen van locaties");
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => { fetchLocations(); }, []);
    const handleAdd = async () => {
        if (!newName.trim())
            return;
        try {
            const { error } = await supabase.from("locations").insert({ name: newName.trim(), sort_order: locations.length });
            if (error) {
                if (error.code === "23505")
                    toast.error("Deze locatie bestaat al");
                else
                    throw error;
                return;
            }
            toast.success(`Locatie "${newName.trim()}" toegevoegd`);
            setNewName("");
            await fetchLocations();
        }
        catch {
            toast.error("Fout bij toevoegen van locatie");
        }
    };
    const handleDelete = async (loc) => {
        if (!confirm(`Weet u zeker dat u "${loc.name}" wilt verwijderen?`))
            return;
        try {
            const { error } = await supabase.from("locations").delete().eq("id", loc.id);
            if (error)
                throw error;
            toast.success(`Locatie "${loc.name}" verwijderd`);
            await fetchLocations();
        }
        catch {
            toast.error("Fout bij verwijderen van locatie");
        }
    };
    return (_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Warehouse, { className: "h-5 w-5 text-primary" }), _jsx(CardTitle, { children: "Locaties" })] }), _jsx(CardDescription, { children: "Beheer uw kassen en opslaglocaties" })] }), _jsxs(CardContent, { className: "space-y-4", children: [loading ? (_jsx("div", { className: "flex items-center justify-center py-8", children: _jsx(Loader2, { className: "h-6 w-6 animate-spin text-muted-foreground" }) })) : locations.length === 0 ? (_jsx("div", { className: "text-center py-8 text-muted-foreground", children: "Geen locaties gevonden" })) : (_jsx("div", { className: "space-y-3 max-h-[280px] overflow-y-auto", children: locations.map((loc) => (_jsxs("div", { className: "flex items-center justify-between rounded-lg border border-border p-3", children: [_jsx("span", { className: "font-medium", children: loc.name }), _jsx(Button, { variant: "ghost", size: "icon", onClick: () => handleDelete(loc), className: "text-destructive hover:text-destructive", title: "Verwijderen", children: _jsx(Trash2, { className: "h-4 w-4" }) })] }, loc.id))) })), _jsxs("div", { className: "flex gap-2", children: [_jsx(Input, { placeholder: "Nieuwe locatie naam...", value: newName, onChange: (e) => setNewName(e.target.value), onKeyDown: (e) => e.key === "Enter" && handleAdd() }), _jsxs(Button, { variant: "outline", onClick: handleAdd, disabled: !newName.trim(), children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Toevoegen"] })] })] })] }));
}
