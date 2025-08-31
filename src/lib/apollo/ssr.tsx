"use client";

import { HttpLink, ApolloLink } from "@apollo/client";
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client-integration-nextjs";
import type { ReactNode } from "react";

function getBaseUrl() {
  if (typeof window !== "undefined") {
    return "";
  }

  return process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : `http://localhost:3000`;
}

function makeClient() {
  const base = getBaseUrl();

  const httpLink = new HttpLink({
    uri: `${base}/api/graphql`,
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([httpLink]),
  });
}

export function ApolloWrapper({ children }: { children: ReactNode }) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
