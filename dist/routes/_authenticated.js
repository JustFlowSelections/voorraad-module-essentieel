import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { Sidebar } from "@flowselections/core";
import { voorraadModule } from "../index";
export const Route = createFileRoute("/_authenticated")({
    beforeLoad: ({ context }) => {
        if (!context.auth?.isAuthenticated) {
            throw redirect({ to: "/login" });
        }
    },
    component: AuthenticatedLayout,
});
function AuthenticatedLayout() {
    const context = Route.useRouteContext();
    return (_jsxs("div", { className: "min-h-screen bg-background", children: [_jsx(Sidebar, { auth: context.auth, modules: [voorraadModule] }), _jsx("div", { className: "ml-64", children: _jsx(Outlet, {}) })] }));
}
