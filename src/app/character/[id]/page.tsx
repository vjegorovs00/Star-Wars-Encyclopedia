import { notFound } from "next/navigation";
import { getClient } from "@/lib/apollo/rsc";
import { PERSON } from "@/graphql/queries";
import CharacterDetails from "./CharacterDetails";

type PageProps = {
  params: { id: string };
};

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

export default async function CharacterPage({ params }: PageProps) {
  const id = decodeURIComponent(params.id);

  const client = getClient();
  const { data } = await client.query<{ person: PersonBasics }>({
    query: PERSON,
    variables: { id },
    fetchPolicy: "cache-first",
  });

  if (!data?.person) return notFound();

  return (
    <main className="mx-auto max-w-screen-md p-4 space-y-4">
      <CharacterDetails id={id} />
    </main>
  );
}
