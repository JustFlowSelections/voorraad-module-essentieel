// Tailwind color classes for category theming
// Maps a color name (stored in product_categories.color) to Tailwind classes
const COLOR_MAP = {
    emerald: { bg: "bg-emerald-500/10", bgHover: "group-hover:bg-emerald-500/20", text: "text-emerald-600", icon: "text-emerald-600", dot: "bg-emerald-500" },
    amber: { bg: "bg-amber-500/10", bgHover: "group-hover:bg-amber-500/20", text: "text-amber-600", icon: "text-amber-600", dot: "bg-amber-500" },
    blue: { bg: "bg-blue-500/10", bgHover: "group-hover:bg-blue-500/20", text: "text-blue-600", icon: "text-blue-600", dot: "bg-blue-500" },
    violet: { bg: "bg-violet-500/10", bgHover: "group-hover:bg-violet-500/20", text: "text-violet-600", icon: "text-violet-600", dot: "bg-violet-500" },
    rose: { bg: "bg-rose-500/10", bgHover: "group-hover:bg-rose-500/20", text: "text-rose-600", icon: "text-rose-600", dot: "bg-rose-500" },
    cyan: { bg: "bg-cyan-500/10", bgHover: "group-hover:bg-cyan-500/20", text: "text-cyan-600", icon: "text-cyan-600", dot: "bg-cyan-500" },
    orange: { bg: "bg-orange-500/10", bgHover: "group-hover:bg-orange-500/20", text: "text-orange-600", icon: "text-orange-600", dot: "bg-orange-500" },
    pink: { bg: "bg-pink-500/10", bgHover: "group-hover:bg-pink-500/20", text: "text-pink-600", icon: "text-pink-600", dot: "bg-pink-500" },
    teal: { bg: "bg-teal-500/10", bgHover: "group-hover:bg-teal-500/20", text: "text-teal-600", icon: "text-teal-600", dot: "bg-teal-500" },
    indigo: { bg: "bg-indigo-500/10", bgHover: "group-hover:bg-indigo-500/20", text: "text-indigo-600", icon: "text-indigo-600", dot: "bg-indigo-500" },
    red: { bg: "bg-red-500/10", bgHover: "group-hover:bg-red-500/20", text: "text-red-600", icon: "text-red-600", dot: "bg-red-500" },
    lime: { bg: "bg-lime-500/10", bgHover: "group-hover:bg-lime-500/20", text: "text-lime-600", icon: "text-lime-600", dot: "bg-lime-500" },
};
const DEFAULT_COLOR = { bg: "bg-primary/10", bgHover: "group-hover:bg-primary/20", text: "text-primary", icon: "text-primary", dot: "bg-primary" };
export const AVAILABLE_COLORS = Object.keys(COLOR_MAP);
export function getCategoryColor(colorName) {
    return COLOR_MAP[colorName || ""] || DEFAULT_COLOR;
}
export function getCategoryBgClass(colorName) {
    const c = getCategoryColor(colorName);
    return `${c.bg} ${c.bgHover}`;
}
export function getCategoryIconClass(colorName) {
    return getCategoryColor(colorName).icon;
}
