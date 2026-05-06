import { createFileRoute } from "@tanstack/react-router";
import { VoorraadPageWithProvider } from "../../components/voorraad/VoorraadPage";

export { VoorraadPage } from "../../components/voorraad/VoorraadPage";

export const Route = createFileRoute("/_authenticated/voorraad")({
  component: VoorraadPageWithProvider,
});
