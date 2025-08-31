"use client";

import { useMemo, useState, useTransition, useEffect, useRef } from "react";
import { useSuspenseQuery } from "@apollo/client/react";
import { ALL_PEOPLE } from "@/graphql/queries";
import Link from "next/link";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";
import {
  groupPeopleByInitial,
  sortInitials,
  sortPeopleByName,
  type PersonLite,
} from "@/lib/people";

import type { ApolloQueryResult } from "@apollo/client";

type SortKey = "name" | "birthYear";
type SortDir = "asc" | "desc";
const SORT_LABEL: Record<SortKey, string> = {
  name: "Name",
  birthYear: "Birth year",
};

// Changing, for example, "19BBY" to -19; '5ABY' -> 5
const toYear = (v?: string | null) => {
  if (!v) return Number.POSITIVE_INFINITY;
  const m = v.match(/^(\d+(?:\.\d+)?)(BBY|ABY)$/i);
  if (!m) return Number.POSITIVE_INFINITY;
  const n = parseFloat(m[1]);
  return m[2].toUpperCase() === "BBY" ? -n : n;
};

function uniqById(list: PersonLite[]): PersonLite[] {
  const seen = new Set<string>();
  const out: PersonLite[] = [];
  for (const p of list) {
    if (!seen.has(p.id)) {
      seen.add(p.id);
      out.push(p);
    }
  }
  return out;
}

interface AllPeopleResponse {
  allPeople: {
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    people: PersonLite[];
  };
}
interface AllPeopleVars {
  first: number;
  after?: string | null;
}

export default function PeopleList() {
  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const [isFetchingMore, startTransition] = useTransition();
  const [isLoadingAll, setIsLoadingAll] = useState(false);

  // against reloading and adding duplicates
  const startedLoadAll = useRef(false);
  const loadedCursors = useRef<Set<string>>(new Set());

  const { data, fetchMore } = useSuspenseQuery<
    AllPeopleResponse,
    AllPeopleVars
  >(ALL_PEOPLE, { variables: { first: 10 } });

  // load every character at the start
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (isLoadingAll || startedLoadAll.current) return;

      const info = data.allPeople?.pageInfo;
      const hasNext: boolean = !!info?.hasNextPage;
      const startCursor: string | undefined = info?.endCursor ?? undefined;

      if (!hasNext || !startCursor) return;

      startedLoadAll.current = true;
      setIsLoadingAll(true);
      try {
        let cursor: string | undefined = startCursor;
        let next: boolean = hasNext;
        let steps = 0;

        while (mounted && next && cursor && steps < 200) {
          if (loadedCursors.current.has(cursor)) break;
          loadedCursors.current.add(cursor);

          const res = (await fetchMore({
            variables: { first: 50, after: cursor },
            updateQuery: (prev, { fetchMoreResult }) => {
              if (!fetchMoreResult) return prev;
              return {
                allPeople: {
                  ...fetchMoreResult.allPeople,
                  people: [
                    ...(prev.allPeople?.people ?? []),
                    ...(fetchMoreResult.allPeople?.people ?? []),
                  ],
                },
              } as AllPeopleResponse;
            },
          })) as ApolloQueryResult<AllPeopleResponse>;

          const pageInfo = res.data?.allPeople?.pageInfo;
          const nextCursor = pageInfo?.endCursor ?? undefined;
          next = !!pageInfo?.hasNextPage;

          if (!nextCursor || nextCursor === cursor) break;

          cursor = nextCursor;
          steps++;
        }
      } finally {
        if (mounted) setIsLoadingAll(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [data.allPeople?.pageInfo?.endCursor]);

  // Filter - sort - group - section order
  const { initials, groups } = useMemo(() => {
    const list = data.allPeople?.people ?? [];

    const filtered = q
      ? list.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()))
      : list;

    // sort by selected field - name/year
    const asc = sortDir === "asc";
    const sorted = [...filtered].sort((a, b) => {
      if (sortKey === "name") {
        return asc
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      // birthYear
      const av = toYear(a.birthYear);
      const bv = toYear(b.birthYear);
      const cmp = asc ? av - bv : bv - av;
      return cmp !== 0 ? cmp : a.name.localeCompare(b.name);
    });

    const grouped = groupPeopleByInitial(sorted);
    const keys = sortInitials(Object.keys(grouped), asc);

    return { initials: keys, groups: grouped };
  }, [data, q, sortKey, sortDir]);

  const handleLoadMore = () => {
    const cursor = data.allPeople?.pageInfo?.endCursor ?? undefined;

    if (!cursor || loadedCursors.current.has(cursor)) return;

    startTransition(() => {
      fetchMore({
        variables: { first: 10, after: cursor },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            allPeople: {
              ...fetchMoreResult.allPeople,
              people: [
                ...(prev.allPeople?.people ?? []),
                ...(fetchMoreResult.allPeople?.people ?? []),
              ],
            },
          } as AllPeopleResponse;
        },
      });
      loadedCursors.current.add(cursor);
    });
  };

  return (
    <section className="space-y-4">
      <div className="sticky top-0 -mx-4 px-4 py-3 bg-black/70 backdrop-blur z-10 space-y-2">
        <Input
          aria-label="Search characters"
          placeholder="Search characters…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="flex gap-2 items-center">
          <label className="text-sm text-slate-400">Sort by</label>
          <select
            className="rounded-md bg-slate-900 px-2 py-1 ring-1 ring-slate-700"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
          >
            <option value="name">{SORT_LABEL.name}</option>
            <option value="birthYear">{SORT_LABEL.birthYear}</option>
          </select>

          <Button
            variant="ghost"
            onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
          >
            Dir: {sortDir.toUpperCase()}
          </Button>

          {isLoadingAll && (
            <span className="text-xs text-slate-400">Loading all…</span>
          )}
        </div>
      </div>

      {/* Empty result for search */}
      {initials.length === 0 && <p>No results{q ? ` for "${q}"` : ""}.</p>}

      {/* Sections from A to Z + # */}
      {initials.map((letter) => {
        const people = groups[letter] ?? [];
        if (people.length === 0) return null;

        return (
          <div key={letter} className="space-y-3">
            {/* Section with letter */}

            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold tabular-nums">{letter}</h2>
              <div className="h-px flex-1 bg-slate-700" />
            </div>

            {/* Character Card*/}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {people.map((p) => (
                <Link
                  key={p.id}
                  href={`/character/${encodeURIComponent(p.id)}`}
                  className="focus-visible:outline-none"
                >
                  <Card className="hover:bg-slate-800 transition">
                    <h3 className="text-lg font-semibold">{p.name}</h3>
                    {p.birthYear && (
                      <p className="text-sm text-slate-400 mt-1">
                        Born: {p.birthYear ?? "Unknown"}
                      </p>
                    )}
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        );
      })}

      {/* Pagination */}

      {data.allPeople?.pageInfo?.hasNextPage && (
        <div className="flex">
          <Button
            onClick={handleLoadMore}
            variant="primary"
            className="w-full md:mx-auto md:w-64 py-3"
            disabled={isFetchingMore || isLoadingAll}
          >
            {isFetchingMore ? "Loading…" : "Load more"}
          </Button>
        </div>
      )}
    </section>
  );
}
