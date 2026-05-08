import { createFileRoute } from "@tanstack/react-router";
import { VoorraadPage } from "../../components/voorraad/VoorraadPage";

export { VoorraadPage } from "../../components/voorraad/VoorraadPage";

export const Route = createFileRoute("/_authenticated/voorraad")({
  component: VoorraadPage,
});
