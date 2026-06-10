"use client";

import { Bell, Search, User, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function Topbar({ title }: { title: string }) {
  return (
    <header className="h-16 border-b border-border flex items-center gap-4 px-6 bg-card/50 backdrop-blur sticky top-0 z-10">
      <h1 className="text-base font-semibold text-foreground flex-1">{title}</h1>

      <div className="relative w-60 hidden md:block">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input placeholder="Search incidents..." className="pl-8 h-8 text-sm bg-background" />
      </div>

      {/* Live status */}
      <div className="flex items-center gap-1.5 text-xs text-green-400">
        <Wifi className="w-3.5 h-3.5" />
        <span>Live</span>
      </div>

      {/* Notifications */}
      <Button variant="ghost" size="icon" className="relative h-8 w-8">
        <Bell className="w-4 h-4" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
      </Button>

      {/* User */}
      <div className="flex items-center gap-2 pl-2 border-l border-border">
        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
          <User className="w-3.5 h-3.5 text-primary" />
        </div>
        <span className="text-sm text-muted-foreground hidden md:block">Operator</span>
      </div>
    </header>
  );
}