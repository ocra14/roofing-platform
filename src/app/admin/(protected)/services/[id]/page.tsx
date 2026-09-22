import { EntityEditor } from "@/components/admin/entity-editor";

export const metadata = { title: "Edit Service" };

type Params = Promise<{ id: string }>;

export default async function AdminServiceEditPage({ params }: { params: Params }) {
  const { id } = await params;
  return <EntityEditor entity="service" id={id} />;
}
