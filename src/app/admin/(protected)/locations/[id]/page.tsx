import { EntityEditor } from "@/components/admin/entity-editor";

export const metadata = { title: "Edit Service Area" };

type Params = Promise<{ id: string }>;

export default async function AdminLocationEditPage({ params }: { params: Params }) {
  const { id } = await params;
  return <EntityEditor entity="location" id={id} />;
}
