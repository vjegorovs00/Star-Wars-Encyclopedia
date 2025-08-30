"use client";

import { useMemo, useState, useTransition } from "react";
import { useSuspenseQuery } from "@apollo/client/react";
import { ALL_PEOPLE } from "@/graphql/queries";
import Link from "next/link";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";

interface AllPeopleResponse {
  allPeople: {
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    people: { id: string; name: string; birthYear?: string | null }[];
  };
}
interface AllPeopleVars {
  first: number;
  after?: string | null;
}

export default function PeopleList() {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"A to Z" | "Z to A">("A to Z");
  const [isFetchingMore, startTransition] = useTransition();

  const { data, fetchMore } = useSuspenseQuery<
    AllPeopleResponse,
    AllPeopleVars
  >(ALL_PEOPLE, { variables: { first: 10 } });

  const people = useMemo(() => {
    const list = data.allPeople?.people ?? [];

    const filtered = q
      ? list.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()))
      : list;

    // Cache from Apollo
    return [...filtered].sort((a, b) =>
      sort === "A to Z"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name),
    );
  }, [data, q, sort]);

  const handleLoadMore = () => {
    const cursor = data.allPeople?.pageInfo?.endCursor;
    if (!cursor) return;
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
        <div className="flex gap-2">
          <Button
            variant="ghost"
            className=""
            onClick={() =>
              setSort((s) => (s === "A to Z" ? "Z to A" : "A to Z"))
            }
          >
            Sort: {sort}
          </Button>
        </div>
      </div>

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
                  Born: {p.birthYear}
                </p>
              )}
            </Card>
          </Link>
        ))}
      </div>

      {data.allPeople?.pageInfo?.hasNextPage && (
        <div className="flex">
          <Button
            onClick={handleLoadMore}
            variant="primary"
            className="w-full md:mx-auto md:w-64 py-3"
            disabled={isFetchingMore}
          >
            {isFetchingMore ? "Loading…" : "Load more"}
          </Button>
        </div>
      )}
    </section>
  );
}
