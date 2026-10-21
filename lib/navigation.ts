/**
 * Navigation configuration and route helpers.
 *
 * Single source of truth for the primary sections so the sidebar, mobile
 * navigation, and breadcrumbs cannot drift apart. Every entry maps to a real
 * route under `app/`.
 */

import {
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  Layers,
  Settings,
  TrendingUp,
  type LucideIcon
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Additional path prefixes that should mark this item active. */
  match?: string[];
};

export const primaryNav: NavItem[] = [
  { label: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
  { label: "Apprendre", href: "/learn", icon: BookOpen, match: ["/lesson"] },
  { label: "Pratiquer", href: "/practice", icon: ClipboardCheck },
  { label: "Cartes éclair", href: "/flashcards", icon: Layers },
  { label: "Examens", href: "/exams", icon: GraduationCap },
  { label: "Progression", href: "/progress", icon: TrendingUp }
];

export const settingsNav: NavItem = { label: "Paramètres", href: "/settings", icon: Settings };

/** True when `pathname` belongs to the nav item, including sub-routes. */
export function isNavActive(item: NavItem, pathname: string): boolean {
  const prefixes = [item.href, ...(item.match ?? [])];
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}
