"use client";

export default function Error({ error }: { error: Error }) {
  return (
    <main className="mx-auto max-w-screen-md p-4 space-y-4">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="text-slate-400 text-sm">{error.message}</p>
    </main>
  );
}
