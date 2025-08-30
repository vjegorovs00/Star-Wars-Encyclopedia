"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="p-4 space-y-2 text-center text-red-600">
      <p>Something went wrong: {error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-red-500 text-white rounded"
      >
        Try again
      </button>
    </div>
  );
}
