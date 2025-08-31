import { HttpLink } from "@apollo/client";
import {
  registerApolloClient,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client-integration-nextjs";

const GRAPHQL_URI = "https://swapi-graphql.azure-api.net/graphql";

export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: GRAPHQL_URI,
      fetch: (_uri, options) =>
        fetch(GRAPHQL_URI, {
          ...(options as RequestInit),
          method: "POST",
          headers: {
            "content-type": "application/json",
            ...(options?.headers as HeadersInit),
          },
        }),
    }),
  });
});
