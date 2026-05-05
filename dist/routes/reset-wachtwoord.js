import { jsx as _jsx } from "react/jsx-runtime";
import { createFileRoute } from "@tanstack/react-router";
import { ResetWachtwoordPage } from "@flowselections/core";
export const Route = createFileRoute("/reset-wachtwoord")({
    component: () => _jsx(ResetWachtwoordPage, { redirectTo: "/voorraad" }),
});
