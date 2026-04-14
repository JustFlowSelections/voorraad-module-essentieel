import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { Sidebar } from "@/components/layout/Sidebar";

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
      <Sidebar auth={context.auth} />
      <div className="ml-64">
        <Outlet />
      </div>
    </div>
  );
}
