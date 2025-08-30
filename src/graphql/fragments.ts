//Here located graphql requests
//Person core and details

import { gql } from "@apollo/client";

export const PERSON_CORE = gql`
  fragment PersonCore on Person {
    id
    name
    birthYear
  }
`;

export const PERSON_DETAILS = gql`
  fragment PersonDetails on Person {
    species {
      name
    }
    homeworld {
      name
      population
    }
    filmConnection {
      films {
        title
        episodeID
        releaseDate
      }
    }
  }
`;
