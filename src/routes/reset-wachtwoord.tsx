import { createFileRoute } from "@tanstack/react-router";
import { ResetWachtwoordPage } from "@flowselections/core";

export const Route = createFileRoute("/reset-wachtwoord")({
  component: () => <ResetWachtwoordPage redirectTo="/voorraad" />,
});