import { useEffect } from "react";
import { Outlet, Link, createRootRouteWithContext, HeadContent, Scripts, useRouter } from "@tanstack/react-router";
import { Toaster, useAuthState, type AuthContext } from "@flowselections/core";
import appCss from "../styles.css?url";

interface RouterContext {
  auth: AuthContext;
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Pagina niet gevonden</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          De pagina die je zoekt bestaat niet of is verplaatst.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Naar startpagina
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Voorraadbeheer" },
      { name: "description", content: "Voorraadbeheer module" },
      { property: "og:title", content: "Voorraadbeheer" },
      { name: "twitter:title", content: "Voorraadbeheer" },
      { property: "og:description", content: "Voorraadbeheer module" },
      { name: "twitter:description", content: "Voorraadbeheer module" },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/7dd360d1-1281-47ac-a0e5-1d36c52eb103/id-preview-47343622--96054acd-ebfa-4ece-81e4-8021eb6325ae.lovable.app-1777971840657.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/7dd360d1-1281-47ac-a0e5-1d36c52eb103/id-preview-47343622--96054acd-ebfa-4ece-81e4-8021eb6325ae.lovable.app-1777971840657.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <>
      <InnerApp />
      <Toaster position="top-right" richColors />
    </>
  );
}

function InnerApp() {
  const auth = useAuthState();
  const router = useRouter();

  useEffect(() => {
    router.update({
      context: { auth } as any,
    });
    router.invalidate();
  }, [auth.isAuthenticated, auth.loading, auth.isAdmin]);

  if (auth.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return <Outlet />;
}
