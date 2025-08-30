import { HttpLink } from "@apollo/client";
import {
  registerApolloClient,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client-integration-nextjs";

const GRAPHQL_URI = "https://swapi-graphql.netlify.app/graphql";

export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: GRAPHQL_URI,
      fetch: (uri, options) => {
        const baseHeaders: HeadersInit = { "content-type": "application/json" };
        const extra: HeadersInit =
          options?.headers instanceof Headers
            ? Object.fromEntries(options.headers.entries())
            : ((options?.headers as HeadersInit) ?? {});

        return fetch(GRAPHQL_URI, {
          ...(options as RequestInit),
          method: "POST",
          headers: { ...baseHeaders, ...extra },
        });
      },
    }),
  });
});
