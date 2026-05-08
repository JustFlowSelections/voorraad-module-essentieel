import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { Sidebar, Header } from "@flowselections/core";
import { voorraadModule } from "../index";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ context }) => {
    if (!(context as any).auth?.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const context = Route.useRouteContext() as any;
  return (
    <div className="min-h-screen bg-background">
      <Sidebar auth={context.auth} modules={[voorraadModule]} />
      <div className="ml-64">
        <Header title="Voorraadbeheer" />
        <Outlet />
      </div>
    </div>
  );
}
