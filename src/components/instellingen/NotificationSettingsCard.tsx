import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Bell, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface NotificationPreferences {
  email_notifications: boolean;
}

export function NotificationSettingsCard() {
  const [prefs, setPrefs] = useState<NotificationPreferences>({ email_notifications: true });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await supabase
          .from("profiles")
          .select("notification_preferences")
          .eq("id", user.id)
          .maybeSingle();
        if (data?.notification_preferences) {
          setPrefs(data.notification_preferences as unknown as NotificationPreferences);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const updatePref = async (key: keyof NotificationPreferences, value: boolean) => {
    const newPrefs = { ...prefs, [key]: value };
    setPrefs(newPrefs);
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Niet ingelogd");
      const { error } = await supabase
        .from("profiles")
        .update({ notification_preferences: newPrefs as unknown as Record<string, unknown> })
        .eq("id", user.id);
      if (error) throw error;
      toast.success("Notificatie-instelling opgeslagen");
    } catch {
      setPrefs(prefs); // rollback
      toast.error("Fout bij opslaan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <CardTitle>Notificatievoorkeuren</CardTitle>
        </div>
        <CardDescription>Beheer je notificatie-instellingen</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">E-mailnotificaties</p>
            <p className="text-xs text-muted-foreground">Ontvang meldingen per e-mail</p>
          </div>
          <Switch
            checked={prefs.email_notifications}
            onCheckedChange={(v) => updatePref("email_notifications", v)}
            disabled={saving}
          />
        </div>
      </CardContent>
    </Card>
  );
}
