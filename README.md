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

```bash
# 1. Clone the repo
git clone https://github.com/vjegorovs00/Star-Wars-Encyclopedia.git
cd Star-Wars-Encyclopedia

# 2. Install dependencies
pnpm install

# if you don’t have pnpm:
npm install -g pnpm

# 3. Run the app
pnpm dev
# or
npm run dev

# 4. Open in browser
http://localhost:3000
```

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

# Changes **Version** 2 :

## GraphQL

- **Fragments** (`fragments.ts`):
  - Added `PERSON_LIST` with essential fields for list view (id, name, birthYear, gender, species, homeworld, films, starships, vehicles).
  - Kept `PERSON_CORE` and `PERSON_RICH` for details page.

- **Queries** (`queries.ts`):
  - `AllPeople` query now spreads `...PersonList`, so client receives all necessary fields for filtering and sorting.
  - `Person` query composes `PersonCore` and `PersonRich` for detailed info.

## Utils

- **people.ts**:
  - Introduced `PersonLite` type.
  - Added helpers: `initialKey`, `sortPeopleByName`, `groupPeopleByInitial`, `sortInitials`.

## Components

- **PeopleList.tsx**:
  - Automatic **full pagination** on initial render (no need to click "Load more" to search Yoda etc.).
  - Sorting:
    - By **Name** (asc/desc).
    - By **Birth year** (asc/desc, using `BBY/ABY` conversion).
  - Grouped rendering by **alphabet initials** (sections A–Z, `#` for non-letter).
  - Deduplication of characters by `id` to prevent duplicates during pagination.
  - Guards against infinite loops when `cursor` does not advance.

---

💡 With these changes the app:

- Fetches **all Star Wars characters** automatically.
- Lets user **search and sort** without extra clicks.
- Shows results grouped **A–Z**, clean and without duplicates.

---

# Changes **Version** 3 :

## Character Details (SSR + Mobile-First)

- **Server prefetch**: `/character/[id]` prefetches data on the server via RSC `getClient().query(PERSON)` → the client gets Apollo's warm cache.
- **UI (mobile-first)**: a neat card with basic facts (name, birth year, species, homeworld, gender/height/mass if available).
- **Films**: a list of movies is displayed (sorted by `episodeID` → by `title`).
- **Loading/Error**: separate `loading.tsx` (skeletons) and `error.tsx` for smooth UX.

## Tech Notes

- **Apollo + Next.js**: the client part uses `/api/graphql` proxy (CORS is eliminated), RSC goes directly to GraphQL.
- **People list**: the initial page loads all character pages once; search and sorting (Name, Birth year) work without "Load more".
- **Duplicates**: when merging pages, deduplication by `id` and protection against duplicate cursors are used.
