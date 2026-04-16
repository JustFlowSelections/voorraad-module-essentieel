import { useState } from "react";
import { Bug, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BugsDialog } from "./BugsDialog";
import { NotificationBell } from "./NotificationBell";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const [bugsDialogOpen, setBugsDialogOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-6">
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Zoeken..." className="w-64 pl-9" />
          </div>
          <Button variant="outline" size="sm" onClick={() => setBugsDialogOpen(true)}>
            <Bug className="mr-2 h-4 w-4" />
            Bugs melden
          </Button>
          <NotificationBell />
        </div>
      </header>
      <BugsDialog open={bugsDialogOpen} onOpenChange={setBugsDialogOpen} />
    </>
  );
}
