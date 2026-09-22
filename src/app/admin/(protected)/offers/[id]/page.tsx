import { EntityEditor } from "@/components/admin/entity-editor";

export const metadata = { title: "Edit Offer" };

type Params = Promise<{ id: string }>;

export default async function AdminOfferEditPage({ params }: { params: Params }) {
  const { id } = await params;
  return <EntityEditor entity="offer" id={id} />;
}
