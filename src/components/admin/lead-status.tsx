export function LeadStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    NEW: "bg-blue-50 text-blue-700 ring-blue-200",
    CONTACTED: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    INSPECTION_SCHEDULED: "bg-purple-50 text-purple-700 ring-purple-200",
    ESTIMATE_SENT: "bg-amber-50 text-amber-700 ring-amber-200",
    WON: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    LOST: "bg-red-50 text-red-700 ring-red-200",
  };
  const labels: Record<string, string> = {
    NEW: "New",
    CONTACTED: "Contacted",
    INSPECTION_SCHEDULED: "Inspection Scheduled",
    ESTIMATE_SENT: "Estimate Sent",
    WON: "Won",
    LOST: "Lost",
  };
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${styles[status] || styles.NEW}`}
    >
      {labels[status] || status}
    </span>
  );
}
