export default function AdminLoading() {
  return (
    <div className="space-y-6 p-1">
      <div className="h-7 w-40 animate-pulse rounded bg-canvas" />
      <div className="h-4 w-64 animate-pulse rounded bg-canvas" />
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="h-24 animate-pulse rounded-xl bg-canvas" />
        <div className="h-24 animate-pulse rounded-xl bg-canvas" />
        <div className="h-24 animate-pulse rounded-xl bg-canvas" />
      </div>
      <div className="h-64 animate-pulse rounded-xl bg-canvas" />
    </div>
  );
}
