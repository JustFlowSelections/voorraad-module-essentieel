
# Plan: Voorraad Module

## Overzicht
Bouw de complete voorraad module in dit project, visueel identiek aan het Fundament Module project (kleuren, lettertype, sidebar, header, login) met de volledige functionaliteit uit het Module Bibliotheek project.

## 1. Visuele basis uit Fundament Module
- **Stijlen**: Kopieer het complete kleurenschema (HSL-gebaseerd, blauwe sidebar `hsl(214 79% 33%)`, lichte achtergrond), Inter lettertype, border-radius, en alle CSS variabelen inclusief `--success`, `--warning`, `--sidebar-muted`
- **Logo**: Kopieer `logo-white.png` naar `src/assets/`
- **Sidebar**: Vaste blauwe zijbalk (256px breed) met logo bovenaan, navigatie-items (Dashboard → Voorraad), instellingen onderaan, uitlogknop — exact zoals Fundament Module
- **Header**: Sticky header met paginatitel, zoekbalk en bugs-melding knop
- **Alle teksten in het Nederlands**

## 2. Authenticatie & Autorisatie (uit Fundament Module)
- **`useAuth` hook**: Sessie-management via Supabase Auth, rollen ophalen uit `user_roles` tabel (bestaande `app_role` enum), profiel ophalen uit `profiles` tabel
- **Login pagina** (`/login`): E-mail/wachtwoord formulier met "wachtwoord vergeten" flow
- **Wachtwoord reset** (`/reset-wachtwoord`): Nieuw wachtwoord instellen na e-mail link
- **Auth guard** (`_authenticated` layout route): Redirect naar `/login` als niet ingelogd
- **Router context**: Auth state beschikbaar in alle routes via `createRootRouteWithContext`
- **Validatie**: Zod schema's voor login formulier

## 3. Voorraad Module (uit Module Bibliotheek)
Alle functionaliteit exact nabouwen:

### Hoofdpagina Voorraadbeheer (`/_authenticated/voorraad`)
- **Zoekbalk**: Zoeken op product of partijnummer
- **Statusfilter**: Alle / Genoeg op voorraad / Bij bestellen / Voorraad op
- **Kolommen instellen**: Popover met checkboxes voor zichtbare kolommen (Liggend, Min., Gereserveerd, Beschikbaar, Inkomend, Economisch)
- **Weergave toggle**: Grid/Lijst weergave
- **Importeren knop**: Excel/CSV import
- **Exporteren knop**: Excel export
- **Nieuw Product knop**: Product toevoegen

### FolderBrowser Component
- Hiërarchische navigatie door voorraad (potmaat → kleur → tint, configureerbaar)
- Breadcrumb navigatie
- Map-iconen met waarschuwingsindicator bij lage voorraad
- Grid en lijst weergave voor mappen én producten
- Statusbadges (OK/Laag/Op) met kleuren

### AddProductDialog
- Stap 1: Type selectie (Levend/Dood) met visuele knoppen
- Stap 2: Formulier met dynamische velden op basis van `product_field_settings` en `product_field_options` tabellen
- Kernvelden: productnaam, barcode (auto-genereer), partijnummer, locatie (uit `locations` tabel), aantal, minimum, eenheid, inkoopprijs, verkoopprijs
- Categorie-specifieke velden op basis van instellingen

### ProductDetailDialog
- Productinformatie weergave met alle velden
- Bewerkingsmodus voor alle velden
- Barcode weergave en download als PNG
- Productfoto upload
- Status badge met kleur

### ImportProductsDialog
- Stap 1: Type selectie (Levend/Dood)
- Stap 2: Bestand uploaden (drag & drop of klik)
- Stap 3: Kolom-mapping met auto-detectie
- Stap 4: Preview van te importeren rijen
- Stap 5: Batch import naar `products` tabel met foutafhandeling

### Inventory Context/Hook
- Alle producten ophalen uit `products` tabel (met paginatie >1000 rijen)
- Gereserveerde hoeveelheden berekenen uit `orders` + `order_items`
- Beschikbare en economische voorraad berekenen
- CRUD operaties: toevoegen, bijwerken, voorraad verminderen
- Instellingen ophalen/opslaan in `inventory_settings`

## 4. Database Tabellen (alleen lezen/schrijven, GEEN wijzigingen)
Gebruikte bestaande tabellen:
- `products` — hoofdtabel voorraad
- `orders` + `order_items` — voor berekening gereserveerde hoeveelheden
- `inventory_settings` — hiërarchie en zichtbare kolommen per tenant
- `product_field_settings` + `product_field_options` — dynamische veldconfiguratie
- `locations` — locatielijst
- `plant_group_members` + `plant_groups` — plantgroepen
- `product_compositions` — samenstellingen
- `profiles` — gebruikersprofielen
- `user_roles` — rollen (admin, manager, warehouse, sales, developer)
- `tenant_users` + `tenants` — multi-tenant koppeling

## 5. Routestructuur
```
src/routes/
  __root.tsx          — Shell + auth context + Toaster
  login.tsx           — Inlogpagina
  reset-wachtwoord.tsx — Wachtwoord reset
  _authenticated.tsx  — Auth guard + sidebar layout
  _authenticated/
    index.tsx         — Dashboard (redirect naar voorraad)
    voorraad.tsx      — Voorraad module
```

## 6. Benodigde packages
- `xlsx` — Excel import/export
- `react-barcode` — Barcode weergave
- `zod` — Formulier validatie
