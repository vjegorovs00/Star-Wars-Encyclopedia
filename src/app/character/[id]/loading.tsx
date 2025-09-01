export default function Loading() {
  return (
    <main className="mx-auto max-w-screen-md p-4 space-y-4">
      <div className="h-6 w-40 rounded bg-slate-800 animate-pulse" />
      <div className="h-32 rounded-2xl bg-slate-900 ring-1 ring-slate-800 animate-pulse" />
      <div className="h-6 w-24 rounded bg-slate-800 animate-pulse" />
      <div className="space-y-2">
        <div className="h-16 rounded-xl bg-slate-900 ring-1 ring-slate-800 animate-pulse" />
        <div className="h-16 rounded-xl bg-slate-900 ring-1 ring-slate-800 animate-pulse" />
      </div>
    </main>
  );
}
