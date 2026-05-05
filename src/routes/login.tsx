import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginPage } from "@flowselections/core";

export const Route = createFileRoute("/login")({
  beforeLoad: ({ context }) => {
    if ((context as any).auth?.isAuthenticated) {
      throw redirect({ to: "/voorraad" });
    }
  },
  component: () => <LoginPage redirectTo="/voorraad" />,
});