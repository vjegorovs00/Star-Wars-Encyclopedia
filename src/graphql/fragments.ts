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

export const PERSON_RICH = gql`
  fragment PersonRich on Person {
    name
    birthYear
    gender
    height
    mass
    eyeColor
    hairColor
    skinColor

    species {
      name
    }
    homeworld {
      name
      population
    }

    filmCollection {
      films {
        title
        episodeID
        releaseDate
      }
    }

    starshipConnection {
      starship {
        name
      }
    }

    vehicleConnection {
      vehicle {
        name
      }
    }
  }
`;
