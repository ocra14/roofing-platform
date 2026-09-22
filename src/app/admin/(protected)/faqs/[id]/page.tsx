import { EntityEditor } from "@/components/admin/entity-editor";

export const metadata = { title: "Edit FAQ" };

type Params = Promise<{ id: string }>;

export default async function AdminFaqEditPage({ params }: { params: Params }) {
  const { id } = await params;
  return <EntityEditor entity="faq" id={id} />;
}
