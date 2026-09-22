import { EntityEditor } from "@/components/admin/entity-editor";

export const metadata = { title: "Edit Review" };

type Params = Promise<{ id: string }>;

export default async function AdminReviewEditPage({ params }: { params: Params }) {
  const { id } = await params;
  return <EntityEditor entity="review" id={id} />;
}
