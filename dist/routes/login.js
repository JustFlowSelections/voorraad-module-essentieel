import { jsx as _jsx } from "react/jsx-runtime";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginPage } from "@flowselections/core";
export const Route = createFileRoute("/login")({
    beforeLoad: ({ context }) => {
        if (context.auth?.isAuthenticated) {
            throw redirect({ to: "/voorraad" });
        }
    },
    component: () => _jsx(LoginPage, { redirectTo: "/voorraad" }),
});
