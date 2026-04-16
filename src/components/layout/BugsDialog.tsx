import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Loader2, CheckCircle, Trash2, Paperclip, X, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { bugReportSchema, validateFileUpload, ALLOWED_FILE_TYPES } from "@/lib/validationSchemas";

interface Bug {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
  attachment_url?: string | null;
  user_id: string;
}

interface BugsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusConfig = {
  open: { label: "Open", variant: "destructive" as const },
  in_progress: { label: "In behandeling", variant: "default" as const },
  resolved: { label: "Opgelost", variant: "secondary" as const },
};

export function BugsDialog({ open, onOpenChange }: BugsDialogProps) {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("list");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);

  const fetchBugs = async () => {
    try {
      const { data, error } = await supabase
        .from("bugs")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setBugs((data as Bug[]) || []);
    } catch {
      toast.error("Fout bij ophalen van bugs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchBugs();
  }, [open]);

  const handleSubmit = async () => {
    const validation = bugReportSchema.safeParse({ title: title.trim(), description: description.trim() });
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Niet ingelogd");

      let attachmentUrl: string | null = null;
      if (attachment) {
        const fileExt = attachment.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('bug-attachments').upload(fileName, attachment);
        if (uploadError) throw uploadError;
        const { data: signedData, error: signedError } = await supabase.storage
          .from('bug-attachments').createSignedUrl(fileName, 3600 * 24 * 7);
        if (signedError) throw signedError;
        attachmentUrl = signedData?.signedUrl || null;
      }

      const { error } = await supabase.from("bugs").insert({
        title: title.trim(),
        description: description.trim(),
        priority: "normaal",
        status: "open",
        attachment_url: attachmentUrl,
        user_id: user.id,
      });
      if (error) throw error;

      toast.success("Bug gemeld!");
      setTitle("");
      setDescription("");
      setAttachment(null);
      setActiveTab("list");
      await fetchBugs();
    } catch {
      toast.error("Fout bij melden van bug");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = validateFileUpload(file);
      if (!validation.valid) {
        toast.error(validation.error);
        return;
      }
      setAttachment(file);
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase.from("bugs").update({ status: newStatus }).eq("id", id);
      if (error) throw error;
      await fetchBugs();
      toast.success("Status bijgewerkt");
    } catch {
      toast.error("Fout bij bijwerken");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("bugs").delete().eq("id", id);
      if (error) throw error;
      await fetchBugs();
      toast.success("Bug verwijderd");
    } catch {
      toast.error("Fout bij verwijderen");
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("nl-NL", {
      day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  const acceptString = ALLOWED_FILE_TYPES.join(",");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Bugs</DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Overzicht ({bugs.filter(b => b.status !== "resolved").length})</TabsTrigger>
            <TabsTrigger value="new">
              <Plus className="mr-2 h-4 w-4" />
              Nieuwe Bug
            </TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="flex-1 overflow-y-auto mt-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : bugs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">Geen bugs gemeld 🎉</div>
            ) : (
              <div className="space-y-3">
                {bugs.map((bug) => {
                  const status = statusConfig[bug.status as keyof typeof statusConfig] || statusConfig.open;
                  return (
                    <div key={bug.id} className="rounded-lg border border-border p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="font-medium">{bug.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{bug.description}</p>
                          {bug.attachment_url && (
                            <a href={bug.attachment_url} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2">
                              <FileText className="h-3 w-3" />
                              Bijlage bekijken
                            </a>
                          )}
                        </div>
                        <Button variant="ghost" size="icon" className="shrink-0" onClick={() => handleDelete(bug.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <Select value={bug.status} onValueChange={(value) => handleUpdateStatus(bug.id, value)}>
                          <SelectTrigger className="h-7 w-auto">
                            <Badge variant={status.variant}>{status.label}</Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open"><Badge variant="destructive">Open</Badge></SelectItem>
                            <SelectItem value="in_progress"><Badge variant="default">In behandeling</Badge></SelectItem>
                            <SelectItem value="resolved"><Badge variant="secondary">Opgelost</Badge></SelectItem>
                          </SelectContent>
                        </Select>
                        <span className="text-xs text-muted-foreground">{formatDate(bug.created_at)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
          <TabsContent value="new" className="flex-1 overflow-y-auto mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bug-title">Titel</Label>
                <Input id="bug-title" placeholder="Korte beschrijving van de bug..." value={title}
                  onChange={(e) => setTitle(e.target.value)} maxLength={200} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bug-description">Beschrijving</Label>
                <Textarea id="bug-description" placeholder="Beschrijf de bug in detail. Wat ging er mis? Wat verwachtte je?"
                  value={description} onChange={(e) => setDescription(e.target.value)} rows={4} maxLength={5000} />
              </div>
              <div className="space-y-2">
                <Label>Bijlage (optioneel)</Label>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept={acceptString} />
                {attachment ? (
                  <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm flex-1 truncate">{attachment.name}</span>
                    <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={removeAttachment}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button type="button" variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
                    <Paperclip className="mr-2 h-4 w-4" />
                    Document toevoegen (max 10MB)
                  </Button>
                )}
                <p className="text-xs text-muted-foreground">Toegestane bestandstypen: PNG, JPEG, GIF, PDF</p>
              </div>
              <Button onClick={handleSubmit} disabled={submitting || !title.trim() || !description.trim()} className="w-full">
                {submitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Melden...</>
                ) : (
                  <><CheckCircle className="mr-2 h-4 w-4" />Bug Melden</>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
