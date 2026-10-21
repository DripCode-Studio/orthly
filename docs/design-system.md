# Design system

## Direction

Orthly is playful enough to invite daily practice and restrained enough for serious exam preparation. It takes inspiration from short learning loops and visible progress without copying another product's brand, mascot, or illustrations.

## Stack

| Concern | Choice |
| --- | --- |
| Styling | Tailwind CSS v4 (`@import "tailwindcss"`) |
| Components | shadcn/ui, `radix-ui` primitives |
| Icons | `lucide-react` only |
| Fonts | Geist (`--font-sans`, body) + Nunito Sans (`--font-heading`, headings) |
| Toasts | `sonner` |
| Charts | `recharts` via the shadcn `chart` component |

**Do not hand-roll components.** Use the shadcn primitives in `components/ui/`. If a needed component is missing, add it with `npx shadcn@latest add <name>` rather than writing one from scratch. Product-specific compositions belong in `components/` and should be built by composing primitives.

Icons come from lucide. Emoji are never used as substitutes for interface icons.

## Tokens

The palette is defined once in `app/globals.css`. shadcn supplies structural tokens (`background`, `primary`, `border`, `radius`, sidebar tokens); Orthly adds product semantics exposed as Tailwind utilities.

| Utility | Value | Meaning |
| --- | --- | --- |
| `primary` / `bg-orthly-learning` | `#58CC02` | Learning actions, completion |
| `bg-orthly-learning-dark` | `#46A302` | Pressed / emphasis on green |
| `bg-orthly-learning-pale` | `#D7FFB8` | Completed lesson surfaces |
| `text-orthly-navy` | `#172B4D` | Deep navy ink |
| `bg-orthly-info` | `#1CB0F6` | Information, learning progress |
| `bg-orthly-milestone` | `#CE82FF` | Achievements, milestones |
| `bg-orthly-streak` | `#FF9600` | Streaks, reminders |
| `bg-orthly-error` / `destructive` | `#FF4B4B` | Errors, mistakes |

Chart tokens (`--chart-1..5`) reuse the same palette so analytics never invent colours.

Use colour consistently. The learning path may be vibrant; lesson reading and exam simulation screens prioritise legibility and restraint.

## Layout

`components/app-shell.tsx` provides the persistent desktop sidebar (shadcn `Sidebar`, collapsible to icons) and a compact mobile top bar with a `SidebarTrigger`. Pages render inside the shell's inset and own their own content width.

- Use a single dominant action per surface.
- Prefer spacing and typography over nested cards.
- Keep exercise actions within reach on mobile (sticky footer during exercises).

## Accessibility

- Semantic headings and landmarks.
- Visible keyboard focus via the shared `ring` token.
- Comfortable touch targets (`size-8` minimum for icon buttons, larger for primary actions).
- `prefers-reduced-motion` is handled globally in `globals.css`.
- Colour is never the only indicator of state — pair it with an icon or text.
- French content uses `lang="fr-CA"`; the root document is already set to `fr-CA`.

## Component vocabulary

Prefer these shadcn primitives when building learning surfaces:

`button`, `card`, `badge`, `progress`, `tabs`, `radio-group`, `checkbox`, `separator`, `avatar`, `dropdown-menu`, `sheet`, `dialog`, `alert-dialog`, `alert`, `sidebar`, `breadcrumb`, `skeleton`, `toggle-group`, `tooltip`, `scroll-area`, `input`, `label`, `select`, `textarea`, `chart`, `sonner`.
