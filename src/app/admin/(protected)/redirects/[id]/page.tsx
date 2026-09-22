import { EntityEditor } from "@/components/admin/entity-editor";

export const metadata = { title: "Edit Redirect" };

type Params = Promise<{ id: string }>;

export default async function AdminRedirectEditPage({ params }: { params: Params }) {
  const { id } = await params;
  return <EntityEditor entity="redirect" id={id} />;
}
