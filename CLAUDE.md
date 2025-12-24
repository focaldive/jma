# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev      # Start dev server with Turbopack
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture Overview

This is a **Next.js 15 App Router** project for the Jaffna Muslim Association UK website. It uses React 18, TypeScript (strict mode), and Tailwind CSS.

### Key Directories

- `/app` - App Router pages and layouts. Each route has a `page.tsx` file.
- `/components` - Feature-scoped components organized by page/feature:
  - `/components/ui` - Shadcn-style UI primitives (Button, Card, Tabs, etc.) built with Radix UI and CVA
  - `/components/home` - NavBar, Footer, Hero, sections for homepage
  - `/components/donate` - Donation forms and PayPal integration
  - `/components/news` - News listing, article display, infinite scroll
  - `/components/projects` - Project stats, charts (Recharts), galleries
- `/lib/utils.ts` - `cn()` utility combining clsx and tailwind-merge
- `/utils` - Data fetching (`fetchPosts.ts`) and env validation
- `/types` - TypeScript interfaces (Project types)

### Component Patterns

- **Server components by default** - Use `"use client"` only when needed for interactivity
- **Feature-scoped organization** - Components grouped by the page they belong to
- **Radix UI primitives** - All interactive elements use accessible Radix components
- **CVA variants** - UI components use Class Variance Authority for variant styling

### External Integrations

1. **WordPress REST API** (`/utils/fetchPosts.ts`)
   - Endpoint: `https://jaffnamuslimuk.org/wp-json/wp/v2/posts`
   - `fetchPosts(page, perPage)` - Paginated news
   - `fetchSinglePost(id)` - Single article

2. **PayPal** (`@paypal/react-paypal-js`)
   - Client ID in `NEXT_PUBLIC_PAYPAL_CLIENT_ID` env var
   - Validated via Zod schema in `/utils/env-validation.ts`

### Styling

- Tailwind CSS with CSS variables for theming (HSL color system)
- Dark mode support (class-based)
- Custom teal color palette defined in tailwind.config.ts
- Use `cn()` from `@/lib/utils` to merge Tailwind classes

### Image Handling

Whitelisted domains in `next.config.ts`:
- `images.unsplash.com`
- `jaffnamuslimuk.org`
- `media.istockphoto.com`
- `img.youtube.com`

### Path Aliases

`@/*` maps to project root (e.g., `@/components/ui/button`)

### Dynamic Routes

- `/news/[id]` - Individual news articles
- `/projects/[year]` - Yearly project breakdowns

### State Management

No global state library. Uses:
- React useState for component-level state
- URL parameters for page-specific state
- Props for parent-child communication
