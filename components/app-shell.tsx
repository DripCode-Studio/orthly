"use client";

import * as React from "react";
import {
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  Layers,
  Settings,
  TrendingUp
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

/**
 * Primary navigation. Labels are French and the icon set is lucide-only, per
 * the design system: no emoji as substitutes for interface icons.
 */
const navigation = [
  { label: "Tableau de bord", icon: LayoutDashboard, href: "#", current: true },
  { label: "Apprendre", icon: BookOpen, href: "#", current: false },
  { label: "Pratiquer", icon: ClipboardCheck, href: "#", current: false },
  { label: "Cartes éclair", icon: Layers, href: "#", current: false },
  { label: "Examens", icon: GraduationCap, href: "#", current: false },
  { label: "Progression", icon: TrendingUp, href: "#", current: false }
];

export function AppSidebar() {
  const [active, setActive] = React.useState("Tableau de bord");

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-[11px_11px_11px_3px] bg-orthly-learning font-heading text-sm font-black text-primary-foreground">
            O
          </span>
          <span className="font-heading text-lg font-black tracking-tight group-data-[collapsible=icon]:hidden">
            orthly
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Ton espace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    isActive={active === item.label}
                    tooltip={item.label}
                    onClick={() => setActive(item.label)}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Separator />
        <div className="flex items-center gap-2 px-1 py-2 group-data-[collapsible=icon]:justify-center">
          <Avatar className="size-8">
            <AvatarFallback className="bg-orthly-navy text-[10px] font-extrabold text-white">ML</AvatarFallback>
          </Avatar>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-xs font-semibold">Mon profil</p>
            <p className="truncate text-[10px] text-muted-foreground">Objectif TFLM</p>
          </div>
        </div>
        <p className="px-1 text-[9px] leading-snug text-muted-foreground group-data-[collapsible=icon]:hidden">
          Progression sauvegardée sur cet appareil.
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}

/** Wraps a page with the persistent sidebar and a mobile top bar. */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-5" />
          <p className="font-heading text-sm font-extrabold">Orthly</p>
          <Button variant="ghost" size="icon-sm" className="ml-auto" aria-label="Paramètres">
            <Settings />
          </Button>
        </header>
        <div className="flex-1 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
