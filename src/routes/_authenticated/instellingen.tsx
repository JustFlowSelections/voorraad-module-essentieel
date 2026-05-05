import { createFileRoute } from "@tanstack/react-router";
import { InstellingenPage } from "@flowselections/core";
import { voorraadModule } from "@/index";

export const Route = createFileRoute("/_authenticated/instellingen")({
  component: () => <InstellingenPage modules={[voorraadModule]} />,
});
