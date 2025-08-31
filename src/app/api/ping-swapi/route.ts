// pinging swapi to check server by address /api/ping-swapi to check
//whether it is showing data
// if bad request && method correct something wrong on the server side
export const dynamic = "force-dynamic";

export async function GET() {
  const res = await fetch("https://swapi-graphql.azure-api.net/graphql", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      query: `
        query PingLuke {
       
            person(id: "cGVvcGxlOjE=") {
              name
              birthYear
              gender
              eyeColor
              hairColor
              skinColor
              species { name }
              homeworld { name population}
              filmConnection { films { title episodeID releaseDate} }
              starshipConnection { starships { name } }
              vehicleConnection { vehicles { name } }
            }
  
        }
      `,
      variables: { first: 1 },
    }),
  });

  const text = await res.text();
  return new Response(text, {
    status: res.status,
    headers: { "content-type": "application/json" },
  });
}
