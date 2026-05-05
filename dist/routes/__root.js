import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect } from "react";
import { Outlet, Link, createRootRouteWithContext, HeadContent, Scripts, useRouter } from "@tanstack/react-router";
import { Toaster, useAuthState } from "@flowselections/core";
function NotFoundComponent() {
    return (_jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: _jsxs("div", { className: "max-w-md text-center", children: [_jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }), _jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Pagina niet gevonden" }), _jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "De pagina die je zoekt bestaat niet of is verplaatst." }), _jsx("div", { className: "mt-6", children: _jsx(Link, { to: "/", className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90", children: "Naar startpagina" }) })] }) }));
}
export const Route = createRootRouteWithContext()({
    head: () => ({
        meta: [
            { charSet: "utf-8" },
            { name: "viewport", content: "width=device-width, initial-scale=1" },
            { title: "Voorraadbeheer" },
            { name: "description", content: "Voorraadbeheer module" },
            { property: "og:title", content: "Voorraadbeheer" },
            { name: "twitter:title", content: "Voorraadbeheer" },
            { property: "og:description", content: "Voorraadbeheer module" },
            { name: "twitter:description", content: "Voorraadbeheer module" },
            { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/7dd360d1-1281-47ac-a0e5-1d36c52eb103/id-preview-47343622--96054acd-ebfa-4ece-81e4-8021eb6325ae.lovable.app-1777971840657.png" },
            { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/7dd360d1-1281-47ac-a0e5-1d36c52eb103/id-preview-47343622--96054acd-ebfa-4ece-81e4-8021eb6325ae.lovable.app-1777971840657.png" },
            { name: "twitter:card", content: "summary_large_image" },
            { property: "og:type", content: "website" },
        ],
        links: [],
    }),
    shellComponent: RootShell,
    component: RootComponent,
    notFoundComponent: NotFoundComponent,
});
function RootShell({ children }) {
    return (_jsxs("html", { lang: "nl", children: [_jsx("head", { children: _jsx(HeadContent, {}) }), _jsxs("body", { children: [children, _jsx(Scripts, {})] })] }));
}
function RootComponent() {
    return (_jsxs(_Fragment, { children: [_jsx(InnerApp, {}), _jsx(Toaster, { position: "top-right", richColors: true })] }));
}
function InnerApp() {
    const auth = useAuthState();
    const router = useRouter();
    useEffect(() => {
        router.update({
            context: { auth },
        });
        if (!auth.loading) {
            router.invalidate();
        }
    }, [auth.isAuthenticated, auth.loading, auth.isAdmin]);
    if (auth.loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-background", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary" }) }));
    }
    return _jsx(Outlet, {});
}
