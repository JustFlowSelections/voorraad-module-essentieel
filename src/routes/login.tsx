import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { loginSchema } from "@/lib/validationSchemas";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  beforeLoad: ({ context }) => {
    if ((context as any).auth?.isAuthenticated) {
      throw redirect({ to: "/voorraad" });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const navigate = Route.useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      toast.error(validation.error.issues[0].message);
      return;
    }
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setIsLoading(false);
    if (error) {
      toast.error("Controleer je e-mailadres en wachtwoord.");
    } else {
      navigate({ to: "/voorraad" });
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error("Vul je e-mailadres in");
      return;
    }
    setForgotLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${window.location.origin}/reset-wachtwoord`,
    });
    setForgotLoading(false);
    if (error) {
      toast.error("Fout bij het versturen van de reset-link");
    } else {
      toast.success("Reset-link verstuurd! Controleer je e-mail.");
      setShowForgot(false);
    }
  };

  if (showForgot) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Wachtwoord vergeten</CardTitle>
            <CardDescription>Vul je e-mailadres in om een reset-link te ontvangen</CardDescription>
          </CardHeader>
          <form onSubmit={handleForgotPassword}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="forgot-email">E-mailadres</Label>
                <Input id="forgot-email" type="email" placeholder="naam@bedrijf.nl" value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)} required maxLength={255} />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={forgotLoading}>
                {forgotLoading ? "Versturen..." : "Reset-link versturen"}
              </Button>
              <button type="button" onClick={() => setShowForgot(false)}
                className="text-sm text-primary hover:underline">
                Terug naar inloggen
              </button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Inloggen</CardTitle>
          <CardDescription>Voer je gegevens in om toegang te krijgen tot het systeem</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mailadres</Label>
              <Input id="email" type="email" placeholder="naam@bedrijf.nl" value={email}
                onChange={(e) => setEmail(e.target.value)} required maxLength={255} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Wachtwoord</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password}
                onChange={(e) => setPassword(e.target.value)} required maxLength={128} />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Bezig met inloggen..." : "Inloggen"}
            </Button>
            <button type="button" onClick={() => setShowForgot(true)}
              className="text-sm text-muted-foreground hover:text-primary hover:underline">
              Wachtwoord vergeten?
            </button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
