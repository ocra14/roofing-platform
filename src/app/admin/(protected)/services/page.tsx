import { EntityList } from "@/components/admin/entity-list";

export const metadata = { title: "Services" };

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminServicesPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  return <EntityList entity="service" searchParams={sp} />;
}
