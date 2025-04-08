import IpsDetailAdmin from "@/components/IpsDetailAdmin";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function IpsDetailPage({ params }: Props) {
  const { id } = await params; // Resolvemos la Promise con await

  return (
    <div className="min-h-screen bg-[#ECF6FF] dark:bg-gray-900 transition-colors duration-300">
      <IpsDetailAdmin id={id} />
    </div>
  );
}