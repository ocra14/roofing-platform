import { EntityList } from "@/components/admin/entity-list";
export const metadata = { title: "FinancingOption" };
type SP = Promise<Record<string, string | string[] | undefined>>;
export default async function Page({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  return <EntityList entity="financingOption" searchParams={sp} />;
}
