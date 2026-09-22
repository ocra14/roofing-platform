import { EntityList } from "@/components/admin/entity-list";
export const metadata = { title: "Team" };
type SP = Promise<Record<string, string | string[] | undefined>>;
export default async function Page({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  return <EntityList entity="teamMember" searchParams={sp} />;
}
