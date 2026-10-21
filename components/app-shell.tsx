"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

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
import { isNavActive, primaryNav, settingsNav } from "@/lib/navigation";
import { cn } from "@/lib/utils";

/**
 * Primary navigation. Each entry is a real Next.js `Link`; the active state is
 * derived from `usePathname`, so navigation actually changes the route.
 */
export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2 px-2 py-1.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-[11px_11px_11px_3px] bg-orthly-learning font-heading text-sm font-black text-primary-foreground">
            O
          </span>
          <span className="font-heading text-lg font-black tracking-tight group-data-[collapsible=icon]:hidden">
            orthly
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Ton espace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {primaryNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isNavActive(item, pathname)} tooltip={item.label}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isNavActive(settingsNav, pathname)} tooltip={settingsNav.label}>
                  <Link href={settingsNav.href}>
                    <settingsNav.icon />
                    <span>{settingsNav.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <Separator />
        <Link
          href="/settings"
          className="flex items-center gap-2 px-1 py-2 group-data-[collapsible=icon]:justify-center"
        >
          <Avatar className="size-8">
            <AvatarFallback className="bg-orthly-navy text-[10px] font-extrabold text-white">ML</AvatarFallback>
          </Avatar>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-xs font-semibold">Mon profil</p>
            <p className="truncate text-[10px] text-muted-foreground">Objectif TFLM</p>
          </div>
          <ChevronRight className="ml-auto size-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
        </Link>
        <p className="px-1 text-[9px] leading-snug text-muted-foreground group-data-[collapsible=icon]:hidden">
          Progression sauvegardée sur cet appareil.
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}

/** A titled page header used inside the shell. */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0 space-y-1">
        {eyebrow ? (
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{eyebrow}</p>
        ) : null}
        <h1 className="font-heading text-2xl font-extrabold tracking-tight">{title}</h1>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

/** Wraps a page with the persistent sidebar and a mobile top bar. */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-5" />
          <Link href="/dashboard" className="font-heading text-sm font-extrabold">
            Orthly
          </Link>
        </header>
        <div className={cn("flex-1 p-4 md:p-6")}>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
