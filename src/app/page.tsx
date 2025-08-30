import { Suspense } from "react";
import { getClient } from "@/lib/apollo/rsc";
import { ALL_PEOPLE } from "@/graphql/queries";
import PeopleList from "./components/sections/PeopleList";

import Loading from "./loading";
import ErrorBoundary from "./ErrorBoundary";

export default async function Page() {
  const client = getClient();
  await client.query({ query: ALL_PEOPLE, variables: { first: 10 } });

  return (
    <main className="mx-auto max-w-screen-md p-4 space-y-4">
      <h1 className="text-2xl font-bold">Star Wars Characters</h1>
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
          <PeopleList />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}
