export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.text();

  const res = await fetch("https://swapi-graphql.azure-api.net/graphql", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
  });

  const text = await res.text();
  return new Response(text, {
    status: res.status,
    headers: { "content-type": "application/json" },
  });
}
