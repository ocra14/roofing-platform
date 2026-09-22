import { EntityList } from "@/components/admin/entity-list";
export const metadata = { title: "Review" };
type SP = Promise<Record<string, string | string[] | undefined>>;
export default async function Page({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  return <EntityList entity="review" searchParams={sp} />;
}
