import { getData } from "@/lib/data";
import { updatePortfolioItem } from "@/lib/actions";
import { notFound } from "next/navigation";
import EditPortfolioForm from "./EditPortfolioForm";

export default async function EditPortfolioItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getData();
  const item = data.portfolio.find((p) => p.id === parseInt(id));
  if (!item) notFound();

  const action = updatePortfolioItem.bind(null, item.id);

  return <EditPortfolioForm item={item} action={action} />;
}
