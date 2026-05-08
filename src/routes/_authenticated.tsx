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

// ─── DEBUG: tijdelijk — zoek element dat sidebar overdekt ────────────────────
function CssDebug() {
  useEffect(() => {
    const aside = document.querySelector("aside");
    if (!aside) { console.warn("❌ Geen <aside> in DOM"); return; }

    const rect = aside.getBoundingClientRect();
    // Prik een punt midden in de sidebar
    const x = rect.left + rect.width / 2;
    const y = rect.top + 80;

    console.group("🔍 Wat ligt bovenop de sidebar?");
    console.log(`aside rect: left=${rect.left}, top=${rect.top}, width=${rect.width}, height=${rect.height}`);
    console.log(`aside z-index (computed): ${getComputedStyle(aside).zIndex}`);
    console.log(`aside visibility: ${getComputedStyle(aside).visibility}`);
    console.log(`aside opacity: ${getComputedStyle(aside).opacity}`);

    // Alle elementen op punt (x, y) — bovenste als eerste
    const elements = document.elementsFromPoint(x, y);
    console.log(`Elementen op punt (${Math.round(x)}, ${Math.round(y)}):`);
    elements.slice(0, 8).forEach((el, i) => {
      const s = getComputedStyle(el);
      const tag = el.tagName.toLowerCase();
      const cls = el.className?.toString().slice(0, 60);
      console.log(
        `  [${i}] <${tag}> class="${cls}" | bg="${s.backgroundColor}" z="${s.zIndex}" opacity="${s.opacity}"`
      );
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
