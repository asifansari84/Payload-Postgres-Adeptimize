# Adeptimize Website & CMS

The marketing website for **Adeptimize**, built on **Payload CMS 3** with a **Next.js 16** frontend and a **PostgreSQL** database. Editors manage every page, service, location, blog post, form and the site header and footer from the Payload admin panel. Changes appear on the live site as soon as they are saved.

---

## Table of contents

- [Tech stack](#tech-stack)
- [Features](#features)
- [Project structure](#project-structure)
- [Content model](#content-model)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [Database & migrations](#database--migrations)
- [Seeding content](#seeding-content)
- [Caching & revalidation](#caching--revalidation)
- [Testing](#testing)
- [Deployment](#deployment)

---

## Tech stack

| Layer            | Technology                                                                 |
| ---------------- | -------------------------------------------------------------------------- |
| CMS              | [Payload CMS](https://payloadcms.com) 3.94 (admin UI, REST & GraphQL API)  |
| Framework        | [Next.js](https://nextjs.org) 16 (App Router, React Server Components)     |
| UI               | React 19, CSS Modules, Tailwind CSS 4                                      |
| Database         | PostgreSQL via `@payloadcms/db-postgres` (Drizzle-based adapter)           |
| Rich text        | Lexical editor (`@payloadcms/richtext-lexical`)                            |
| Image processing | Sharp (resizing, focal point)                                              |
| Language         | TypeScript 5.7                                                             |
| Testing          | Vitest + Testing Library (integration), Playwright (end-to-end)            |
| Code quality     | ESLint 9 (`eslint-config-next`), Prettier                                  |
| Runtime          | Node.js 22 / 24+                                                           |

## Features

- **Admin panel** at `/admin` with a custom content dashboard. Posts, Pages and Media are listed first.
- **Page builder:** reusable blocks (Hero, Logo Showcase, Feature Grid, Process, Differentiators, Image Accordion, Testimonials, Service Carousel, Logo Strip, FAQ) with preview thumbnails.
- **Fixed-layout pages:** Home, About Us, Our Services, Location, Blog and Contact Us. Each section is edited in its own tab.
- **Services & Locations:** listing collections with section tabs, card settings and per-item SEO, served at `/service-item/[slug]` and on the Location page.
- **Blog:** posts with a featured image, Lexical article body and a dedicated **SEO tab**. The SEO tab has a live search preview, a canonical URL, robots (`noindex`) settings and social metadata.
- **Forms:** forms built in the CMS (text, email, phone, long text) that submit to `/api/forms/[slug]`. Submissions are stored in **Contact Submissions** with a status workflow (New → In progress → Resolved). Spam is filtered with a honeypot field. The newsletter signup works the same way.
- **Global header & footer:** menu links, a full-screen menu panel and the footer, all editable from the CMS.
- **Instant updates:** Payload hooks clear the Next.js cache after every change or delete.
- **Fallback content:** if the CMS or database is unavailable, the site serves static HTML copies of the pages.
- **Type safety:** TypeScript types are generated from the Payload schema (`src/payload-types.ts`).

## Project structure

```
.
├── public/                     # Static assets (site images, admin block previews)
├── scripts/                    # Seed, import and revalidation scripts (run with tsx)
├── src/
│   ├── app/
│   │   ├── (frontend)/         # Public website routes (home, about, blog, services, …)
│   │   ├── (payload)/          # Payload admin, REST API and GraphQL routes
│   │   └── api/                # Custom endpoints: forms, revalidate
│   ├── blocks/                 # Page-builder block definitions
│   ├── collections/            # Payload collections and shared section tabs
│   ├── components/
│   │   ├── admin/              # Custom admin UI (dashboard, SEO preview, row labels)
│   │   ├── blocks/             # Frontend renderers for page-builder blocks
│   │   ├── sections/           # Page sections (about, blog, contact, listing, …)
│   │   ├── site/               # Header, footer, menu drawer, navigation progress
│   │   └── ui/                 # Shared helpers and icons
│   ├── content/                # Archived blog post HTML and manifest (seed source)
│   ├── fields/                 # Reusable field factories (image, link, …)
│   ├── globals/                # Header and Footer globals
│   ├── hooks/                  # Cache revalidation hooks
│   ├── lib/                    # CMS data access, routes, post metadata
│   ├── migrations/             # Payload / Postgres migrations
│   ├── payload.config.ts       # Payload configuration
│   └── payload-types.ts        # Generated types (do not edit)
├── tests/
│   ├── e2e/                    # Playwright tests (admin + frontend)
│   └── int/                    # Vitest API integration tests
└── next.config.ts
```

## Content model

**Collections**

| Collection            | Slug                  | Purpose                                                    |
| --------------------- | --------------------- | ---------------------------------------------------------- |
| Pages                 | `pages`               | Site pages, edited with section tabs or the page builder   |
| Services              | `services`            | Service detail pages and service cards                     |
| Locations             | `locations`           | Location pages and slides for the Location page slider     |
| Posts                 | `posts`               | Blog articles, with SEO metadata                           |
| Media                 | `media`               | Uploaded images                                            |
| Forms                 | `forms`               | Forms built in the CMS, with draft and published states    |
| Contact Submissions   | `contact-submissions` | Form entries, with a status workflow                       |
| Users                 | `users`               | Admin accounts, with authentication enabled                |

**Globals:** `header` (header, menu links and menu panel) and `footer`.

## Getting started

### Prerequisites

- Node.js `22.23.5+` or `24.22.3+`
- PostgreSQL 14+ (local, or hosted such as Supabase, Neon or Vercel Postgres)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure the environment
cp .env.example .env
#    then edit DATABASE_URL and PAYLOAD_SECRET

# 3. Create the database schema
npm run migrate

# 4. (Optional) Load the site content
npm run seed:content

# 5. Start the dev server
npm run dev
```

- Website: <http://localhost:3000>
- Admin panel: <http://localhost:3000/admin>. On first visit you will be asked to create the first admin user.

## Environment variables

| Variable               | Required | Description                                                             |
| ---------------------- | -------- | ----------------------------------------------------------------------- |
| `DATABASE_URL`         | Yes      | Postgres connection string. `POSTGRES_URL` is used if this is not set.  |
| `PAYLOAD_SECRET`       | Yes      | Long random string. Used for auth tokens and the revalidate endpoint.   |
| `NEXT_PUBLIC_SITE_URL` | Yes      | Public site origin, used for canonical and social URLs (e.g. `https://adeptimize.com`). |
| `PAYLOAD_DB_PUSH`      | No       | Set to `true` to auto-push schema changes. **Development databases only.** |

Never commit `.env`. To generate a secret, run `openssl rand -hex 32`.

## Scripts

| Command                        | Description                                         |
| ------------------------------ | --------------------------------------------------- |
| `npm run dev`                  | Start the development server                        |
| `npm run devsafe`              | Clear `.next`, then start the development server    |
| `npm run build`                | Production build                                    |
| `npm run start`                | Serve the production build                          |
| `npm run lint`                 | Run ESLint                                          |
| `npm run migrate`              | Apply pending database migrations                   |
| `npm run migrate:create`       | Create a migration from schema changes              |
| `npm run generate:types`       | Regenerate `src/payload-types.ts`                   |
| `npm run generate:importmap`   | Regenerate the admin component import map           |
| `npm run seed:content`         | Seed all content (posts, pages, forms, …)           |
| `npm run seed:posts`           | Import the 11 archived blog posts and their images  |
| `npm run seed:home`            | Seed the homepage                                   |
| `npm run seed:pages`           | Seed the fixed pages                                |
| `npm run seed:listings`        | Seed services and locations                         |
| `npm run revalidate`           | Clear the running site's CMS cache                  |
| `npm run test:int`             | Run integration tests (Vitest)                      |
| `npm run test:e2e`             | Run end-to-end tests (Playwright)                   |

## Database & migrations

Schema changes are managed with **migrations**. Schema push is turned off by default.

1. Edit a collection, global or block in `src/`.
2. Create a migration: `npm run migrate:create`
3. Regenerate types: `npm run generate:types`
4. If you added admin components: `npm run generate:importmap`
5. Commit the migration files in `src/migrations/` together with the code change.
6. Apply the migrations in each environment with `npm run migrate`.

## Seeding content

The seed scripts import the original site content into Payload. This includes the archived blog posts in `src/content/`, the page sections and the editable contact form.

```bash
npm run seed:content   # everything
npm run seed:posts     # blog posts only
```

When they finish, the scripts call the revalidate endpoint so a running site shows the new content immediately.

## Caching & revalidation

CMS reads are cached under the Next.js tag `cms`. The cache is cleared:

- **Automatically**, by Payload `afterChange` and `afterDelete` hooks on every collection and global.
- **On demand**, by sending `POST /api/revalidate` with the `x-revalidate-secret: <PAYLOAD_SECRET>` header. `npm run revalidate` does this for you. The secret is compared in constant time.

## Testing

```bash
npm run test:int   # Vitest: API integration tests (tests/int)
npm run test:e2e   # Playwright: admin + frontend flows (tests/e2e)
```

Test environment settings are in `test.env`.

## Deployment

1. Provision a PostgreSQL database and set the [environment variables](#environment-variables).
2. Install and build: `npm ci && npm run build`
3. Apply migrations: `npm run migrate`. Run this on every deploy, before starting the server.
4. Start the server: `npm run start`

The project can be deployed to any Node.js host (Vercel, Railway, Render, a VPS, …). For container deployment, a multi-stage `Dockerfile` is included. It requires `output: 'standalone'` in `next.config.ts`.

Uploaded media is stored on the local filesystem by default. On serverless or ephemeral hosts, configure a Payload storage adapter (such as S3 or Vercel Blob) so uploads persist between deploys.
