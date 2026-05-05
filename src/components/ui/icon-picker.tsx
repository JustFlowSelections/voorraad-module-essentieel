import { useState } from "react";
import {
  Leaf, Box, Flower, Flower2, TreePine, TreeDeciduous, Sprout,
  Apple, Cherry, Grape, Carrot, Bean,
  Package, PackageOpen, Truck, ShoppingCart, ShoppingBag,
  Warehouse, Store, Tag, Tags, Layers,
  Droplets, Sun, CloudRain, Thermometer, Wind,
  Scissors, Shovel, Hammer, Wrench, Palette,
  Heart, Star, CircleDot, Square, Triangle,
  Wheat, Clover, Trees, Mountain, Globe,
} from "lucide-react";
import { cn } from "@flowselections/core";
import { Popover, PopoverContent, PopoverTrigger } from "@flowselections/core";
import { Button } from "@flowselections/core";

export const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  leaf: Leaf,
  box: Box,
  flower: Flower,
  "flower-2": Flower2,
  "tree-pine": TreePine,
  "tree-deciduous": TreeDeciduous,
  sprout: Sprout,
  apple: Apple,
  cherry: Cherry,
  grape: Grape,
  carrot: Carrot,
  bean: Bean,
  package: Package,
  "package-open": PackageOpen,
  truck: Truck,
  "shopping-cart": ShoppingCart,
  "shopping-bag": ShoppingBag,
  warehouse: Warehouse,
  store: Store,
  tag: Tag,
  tags: Tags,
  layers: Layers,
  droplets: Droplets,
  sun: Sun,
  "cloud-rain": CloudRain,
  thermometer: Thermometer,
  wind: Wind,
  scissors: Scissors,
  shovel: Shovel,
  hammer: Hammer,
  wrench: Wrench,
  palette: Palette,
  heart: Heart,
  star: Star,
  "circle-dot": CircleDot,
  square: Square,
  triangle: Triangle,
  wheat: Wheat,
  clover: Clover,
  trees: Trees,
  mountain: Mountain,
  globe: Globe,
};

const ICON_LABELS: Record<string, string> = {
  leaf: "Blad", box: "Doos", flower: "Bloem", "flower-2": "Bloem 2",
  "tree-pine": "Dennenboom", "tree-deciduous": "Loofboom", sprout: "Kiemplant",
  apple: "Appel", cherry: "Kers", grape: "Druif", carrot: "Wortel", bean: "Boon",
  package: "Pakket", "package-open": "Pakket open", truck: "Vrachtwagen",
  "shopping-cart": "Winkelwagen", "shopping-bag": "Boodschappentas",
  warehouse: "Magazijn", store: "Winkel", tag: "Label", tags: "Labels",
  layers: "Lagen", droplets: "Druppels", sun: "Zon", "cloud-rain": "Regen",
  thermometer: "Thermometer", wind: "Wind", scissors: "Schaar", shovel: "Schep",
  hammer: "Hamer", wrench: "Moersleutel", palette: "Palet", heart: "Hart",
  star: "Ster", "circle-dot": "Cirkel", square: "Vierkant", triangle: "Driehoek",
  wheat: "Tarwe", clover: "Klaver", trees: "Bomen", mountain: "Berg", globe: "Wereld",
};

interface IconPickerProps {
  value: string | null;
  onChange: (iconName: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const SelectedIcon = value && ICON_MAP[value] ? ICON_MAP[value] : Tag;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="h-10 w-10 shrink-0" title="Kies icoon">
          <SelectedIcon className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-3" align="start">
        <p className="text-xs text-muted-foreground mb-2 font-medium">Kies een icoon</p>
        <div className="grid grid-cols-8 gap-1">
          {Object.entries(ICON_MAP).map(([name, Icon]) => (
            <button
              key={name}
              type="button"
              onClick={() => { onChange(name); setOpen(false); }}
              className={cn(
                "flex items-center justify-center h-9 w-9 rounded-md hover:bg-accent transition-colors",
                value === name && "bg-primary/10 ring-2 ring-primary"
              )}
              title={ICON_LABELS[name] || name}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

/** Render an icon by its stored name. Falls back to Tag. */
export function DynamicIcon({ name, className }: { name: string | null; className?: string }) {
  const Icon = name && ICON_MAP[name] ? ICON_MAP[name] : Tag;
  return <Icon className={className} />;
}
