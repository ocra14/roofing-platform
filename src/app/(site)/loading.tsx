export default function SiteLoading() {
  return (
    <div className="container-page py-16">
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-2/3 rounded bg-canvas" />
        <div className="h-4 w-full rounded bg-canvas" />
        <div className="h-4 w-5/6 rounded bg-canvas" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="h-48 rounded-xl bg-canvas" />
          <div className="h-48 rounded-xl bg-canvas" />
          <div className="h-48 rounded-xl bg-canvas" />
        </div>
      </div>
    </div>
  );
}
