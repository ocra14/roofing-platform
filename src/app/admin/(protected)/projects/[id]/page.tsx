import { EntityEditor } from "@/components/admin/entity-editor";

export const metadata = { title: "Edit Project" };

type Params = Promise<{ id: string }>;

export default async function AdminProjectEditPage({ params }: { params: Params }) {
  const { id } = await params;
  return <EntityEditor entity="project" id={id} />;
}
