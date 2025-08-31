import { gql } from "@apollo/client";
import { PERSON_LIST, PERSON_CORE, PERSON_RICH } from "./fragments";

export const ALL_PEOPLE = gql`
  ${PERSON_LIST}
  query AllPeople($first: Int!, $after: String) {
    allPeople(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      people {
        ...PersonList
      }
    }
  }
`;

export const PERSON = gql`
  ${PERSON_CORE}
  ${PERSON_RICH}
  query Person($id: ID!) {
    person(id: $id) {
      ...PersonCore
      ...PersonRich
    }
  }
`;
