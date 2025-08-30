# SWAPI Encyclopedia (Next.js + Apollo SSR)

Mobile-first Star Wars character encyclopedia built with **Next.js (App Router)**, **TypeScript**, **Apollo Client (SSR)**, and **Tailwind CSS**.

## Stack

- Next.js 15 (App Router), TypeScript
- Apollo Client + `@apollo/client-integration-nextjs` (RSC prefetch + SSR hydration)
- GraphQL (SWAPI)
- Tailwind CSS

## Features

- **People List:** Search, Sorting (ascending/descending), pagination;
- **Characters Page:** Detailed information for each character (species, homeworld, films)
- **Route Boundaries:** Custom 'loading.tsx' and 'error.tsx' for better UX
- **SSR & RSC Integration:** Appolo Client with prefetching and caching

## Why `/graphql` endpoint?

The Netlify function redirects `/.netlify/functions/index` to `/graphql`. Redirects may turn POST into GET, losing the body. I use direct `/graphql` with explicit POST to avoid `Missing query` errors.

## How to run

**1.Install dependencies:**
`bash
    pnpm install
    pnpm dev
    # open http://localhost:3000
    `
**2.Run the app**
`bash
    pnpm dev
    # open http://localhost:3000
    `

---

# Changes **Version** 1 :

## Architecture

- **Server prefetch (RSC):** src/lib/apollo/rsc.ts → getClient().query(...) in server pages (e.g., app/page.tsx)
- **Client hydration:** src/lib/apollo/ssr.tsx wraps the app with ApolloNextAppProvider so client components can use Apollo hooks
- **UI** src/components/ui/{Button,Input,Card}.tsx
- **GraphQL** src/graphql/{fragments,queries}.ts

## Implemented

- **People list (mobile-first):** search, sorting (asc/desc), fetchMore pagination
- **Route boundaries (loading/error)** for the root route
- **Apollo SSR integration** (RSC prefetch + client hydration)

## Next steps

- Character page /character/[id] with details (species, homeworld, films)
- Apollo typePolicies for cursor pagination
- GraphQL Codegen for strict TS types
- Basic tests (Vitest + RTL)
- Visual Changes via Tailwind
