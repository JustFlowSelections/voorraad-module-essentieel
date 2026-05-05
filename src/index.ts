import { Package } from "lucide-react";
import type { FlowModule } from "@flowselections/core";

import { FieldOptionsDialog } from "./components/instellingen/FieldOptionsDialog";
import { InventoryNavigationCard } from "./components/instellingen/InventoryNavigationCard";
import { LocationsCard } from "./components/instellingen/LocationsCard";
import { ProductCategoriesCard } from "./components/instellingen/ProductCategoriesCard";
import { ProductFieldsCard } from "./components/instellingen/ProductFieldsCard";

export const voorraadModule: FlowModule = {
  id: "voorraad",
  name: "Voorraadbeheer",
  version: "1.0.0",

  nav: {
    label: "Voorraad",
    href: "/voorraad",
    icon: Package,
  },

  settingsCards: [
    { component: ProductCategoriesCard, order: 10 },
    { component: ProductFieldsCard,     order: 20 },
    { component: LocationsCard,         order: 30 },
    { component: InventoryNavigationCard, order: 40 },
  ],
};
