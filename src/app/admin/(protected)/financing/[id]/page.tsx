import { EntityEditor } from "@/components/admin/entity-editor";

export const metadata = { title: "Edit Financing Option" };

type Params = Promise<{ id: string }>;

export default async function AdminFinancingEditPage({ params }: { params: Params }) {
  const { id } = await params;
  return <EntityEditor entity="financingOption" id={id} />;
}
