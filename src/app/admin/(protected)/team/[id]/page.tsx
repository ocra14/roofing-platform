import { EntityEditor } from "@/components/admin/entity-editor";

export const metadata = { title: "Edit Team Member" };

type Params = Promise<{ id: string }>;

export default async function AdminTeamEditPage({ params }: { params: Params }) {
  const { id } = await params;
  return <EntityEditor entity="teamMember" id={id} />;
}
