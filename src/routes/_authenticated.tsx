import { useEffect } from "react";
import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { Sidebar } from "@flowselections/core";
import { voorraadModule } from "../index";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ context }) => {
    if (!(context as any).auth?.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: AuthenticatedLayout,
});

// ─── DEBUG: tijdelijk — log CSS variabelen naar console ───────────────────────
function CssDebug() {
  useEffect(() => {
    const root = document.documentElement;
    const style = getComputedStyle(root);
    const vars = [
      "--sidebar",
      "--sidebar-foreground",
      "--sidebar-accent",
      "--sidebar-muted",
      "--sidebar-border",
      "--background",
      "--primary",
    ];
    console.group("🎨 CSS-variabelen debug");
    vars.forEach((v) => {
      const val = style.getPropertyValue(v).trim();
      console.log(`${v}: "${val}" ${val ? "✅" : "❌ LEEG!"}`);
    });

    // Controleer of bg-sidebar klasse effect heeft
    const aside = document.querySelector("aside");
    if (aside) {
      const asideStyle = getComputedStyle(aside);
      console.log("aside background-color:", asideStyle.backgroundColor);
      console.log("aside className:", aside.className);
    } else {
      console.warn("❌ Geen <aside> element gevonden in de DOM");
    }

    // Controleer of de stylesheet geladen is
    const sheets = Array.from(document.styleSheets);
    console.log(`Geladen stylesheets: ${sheets.length}`);
    sheets.forEach((s, i) => {
      try {
        console.log(`  [${i}] ${s.href || "(inline)"} — ${s.cssRules?.length ?? "?"} regels`);
      } catch {
        console.log(`  [${i}] ${s.href} — (CORS: regels niet leesbaar)`);
      }
    });
    console.groupEnd();
  }, []);
  return null;
}
// ─────────────────────────────────────────────────────────────────────────────

function AuthenticatedLayout() {
  const context = Route.useRouteContext() as any;
  return (
    <div className="min-h-screen bg-background">
      <CssDebug />
      <Sidebar auth={context.auth} modules={[voorraadModule]} />
      <div className="ml-64">
        <Outlet />
      </div>
    </div>
  );
}
