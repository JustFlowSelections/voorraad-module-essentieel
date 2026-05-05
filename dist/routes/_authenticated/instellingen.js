import { jsx as _jsx } from "react/jsx-runtime";
import { createFileRoute } from "@tanstack/react-router";
import { InstellingenPage } from "@flowselections/core";
import { voorraadModule } from "../../index";
export const Route = createFileRoute("/_authenticated/instellingen")({
    component: () => _jsx(InstellingenPage, { modules: [voorraadModule] }),
});
