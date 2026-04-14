import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-wachtwoord")({
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const navigate = Route.useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes("type=recovery")) {
      setIsReady(true);
    }
    // Also listen for auth state change to detect recovery
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsReady(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Wachtwoord moet minimaal 6 tekens bevatten");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Wachtwoorden komen niet overeen");
      return;
    }
    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setIsLoading(false);
    if (error) {
      toast.error("Fout bij het instellen van het nieuwe wachtwoord");
    } else {
      toast.success("Wachtwoord succesvol gewijzigd!");
      navigate({ to: "/voorraad" });
    }
  };

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Ongeldige link</CardTitle>
            <CardDescription>
              Deze reset-link is ongeldig of verlopen. Vraag een nieuwe aan via de inlogpagina.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button onClick={() => navigate({ to: "/login" })}>Naar inlogpagina</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Nieuw wachtwoord instellen</CardTitle>
          <CardDescription>Kies een nieuw wachtwoord voor je account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nieuw wachtwoord</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password}
                onChange={(e) => setPassword(e.target.value)} required minLength={6} maxLength={128} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Bevestig wachtwoord</Label>
              <Input id="confirmPassword" type="password" placeholder="••••••••" value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} maxLength={128} />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Opslaan..." : "Wachtwoord opslaan"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
