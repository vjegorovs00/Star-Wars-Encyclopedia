"use client";

import Link from "next/link";
import { useSuspenseQuery } from "@apollo/client/react";
import { PERSON } from "@/graphql/queries";

type FilmLite = {
  title?: string | null;
  episodeID?: number | null;
  releaseDate?: string | null;
};
type PersonBasics = {
  name: string;
  birthYear?: string | null;
  gender?: string | null;
  height?: number | null;
  mass?: number | null;
  species?: { name?: string | null } | null;
  homeworld?: { name?: string | null } | null;
  filmConnection?: { films?: FilmLite[] | null } | null;
};

type Props = { id: string };

export default function CharacterDetails({ id }: Props) {
  const { data } = useSuspenseQuery<{ person: PersonBasics }, { id: string }>(
    PERSON,
    {
      variables: { id },
    },
  );

  const p = data.person;

  const species = p.species?.name ?? "Unknown";
  const homeworld = p.homeworld?.name ?? "Unknown";
  const birthYear = p.birthYear ?? "Unknown";

  const films = (p.filmConnection?.films ?? []).slice().sort((a, b) => {
    if (a?.episodeID != null && b?.episodeID != null)
      return a.episodeID - b.episodeID;
    return (a?.title ?? "").localeCompare(b?.title ?? "");
  });

  return (
    <section className="space-y-4">
      <div className="-mt-2 text-center">
        <Link
          href="/"
          className="text-lg text-slate-400 hover:text-slate-200 justify-center flex"
        >
          <div className="border-sky-700 bg-slate-700 border-2 w-[200px] h-[60px] rounded-2xl flex items-center justify-center">
            Back to list
          </div>
        </Link>
      </div>

      <header className="space-y-1">
        <h1 className="text-2xl font-bold">{p.name}</h1>
        <p className="text-slate-400 text-sm">Birth year: {birthYear}</p>
      </header>

      <div className="rounded-2xl bg-slate-900 p-4 ring-1 ring-slate-800 shadow-sm">
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-400">
              Species
            </dt>
            <dd className="text-base">{species}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-400">
              Homeworld
            </dt>
            <dd className="text-base">{homeworld}</dd>
          </div>
          {p.gender ? (
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400">
                Gender
              </dt>
              <dd className="text-base capitalize">{p.gender}</dd>
            </div>
          ) : null}
          {p.height ? (
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400">
                Height
              </dt>
              <dd className="text-base">{p.height} cm</dd>
            </div>
          ) : null}
          {p.mass ? (
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400">
                Mass
              </dt>
              <dd className="text-base">{p.mass} kg</dd>
            </div>
          ) : null}
        </dl>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Films</h2>
        {films.length === 0 ? (
          <p className="text-slate-400 text-sm">No films listed.</p>
        ) : (
          <ul className="space-y-2">
            {films.map((f, i) => (
              <li
                key={`${f?.title ?? "film"}-${f?.episodeID ?? i}`}
                className="rounded-xl bg-slate-900 p-3 ring-1 ring-slate-800"
              >
                <div className="font-medium">{f?.title ?? "Untitled"}</div>
                <div className="text-xs text-slate-400">
                  {f?.episodeID != null ? `Episode ${f.episodeID}` : null}
                  {f?.releaseDate
                    ? (f?.episodeID != null ? " • " : "") +
                      new Date(f.releaseDate).toLocaleDateString()
                    : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
