/**
 * Safelist voor @flowselections/core componenten.
 *
 * Dit bestand wordt NOOIT geïmporteerd op runtime. Het bestaat zodat
 * Tailwind v4 deze utility classes altijd genereert, ook als de
 * @source scan van node_modules/core mist (bijv. op de Lovable build server).
 *
 * Voeg hier classes toe als ze gebruikt worden in core componenten
 * (Sidebar, Header, InstellingenPage, etc.) maar ontbreken in de build output.
 */
// Layout wrapper — _authenticated.tsx
const _layout = [
    "min-h-screen bg-background",
    "ml-64",
];
// InstellingenPage — core/InstellingenPage.tsx
const _instellingen = [
    "grid grid-cols-2 grid-cols-3",
    "gap-2 gap-6",
    "p-6",
    "space-y-2 space-y-4 space-y-6",
    "max-w-4xl mx-auto",
];
// Sidebar layout — _authenticated.tsx → core/Sidebar.tsx
const _sidebar = [
    // Structuur
    "fixed left-0 top-0 z-40 h-screen w-64",
    "flex flex-col flex-1 flex-shrink-0",
    "h-20 overflow-y-auto space-y-1",
    "items-center justify-center justify-between",
    "w-full text-left",
    "ml-3",
    // Kleuren
    "bg-sidebar bg-sidebar-accent bg-sidebar-border",
    "text-sidebar-foreground text-sidebar-muted",
    "text-sidebar-accent-foreground text-sidebar-primary-foreground",
    // Borders
    "border-b border-t border-sidebar-border",
    // Spacing
    "px-3 px-4 py-4 py-2 py-2.5 gap-3",
    // Hover states
    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
    // Algemeen
    "rounded-lg text-sm font-medium transition-colors cursor-pointer",
    "rotate-180",
    "sidebar-scroll",
];
export {};
