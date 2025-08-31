import { gql } from "@apollo/client";

export const PERSON_CORE = gql`
  fragment PersonCore on Person {
    id
    name
    birthYear
  }
`;

export const PERSON_LIST = gql`
  fragment PersonList on Person {
    id
    name
    birthYear
    gender
    species {
      name
    }
    homeworld {
      name
    }
    filmConnection {
      films {
        title
      }
    }
    starshipConnection {
      starships {
        name
      }
    }
    vehicleConnection {
      vehicles {
        name
      }
    }
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
    filmConnection {
      films {
        title
        episodeID
        releaseDate
      }
    }
    starshipConnection {
      starships {
        name
      }
    }
    vehicleConnection {
      vehicles {
        name
      }
    }
  }
`;
