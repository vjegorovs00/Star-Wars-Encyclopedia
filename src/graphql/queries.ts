import { gql } from "@apollo/client";

export const ALL_PEOPLE = gql`
  query AllPeople($first: Int!, $after: String) {
    allPeople(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      people {
        id
        name
        birthYear
      }
    }
  }
`;
