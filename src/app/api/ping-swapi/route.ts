// pinging swapi to check server by address /api/ping-swapi to check
//whether it is showing data
// if bad request && method correct something wrong on the server side
export const dynamic = "force-dynamic";

export async function GET() {
  const res = await fetch("https://swapi-graphql.netlify.app/graphql", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      query: "{ allPeople(first:1) { people { name } } }",
    }),
  });

  const text = await res.text();
  return new Response(text, {
    status: res.status,
    headers: { "content-type": "application/json" },
  });
}
