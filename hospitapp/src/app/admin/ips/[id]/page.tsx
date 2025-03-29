// src/app/admin/ips/[id]/page.tsx
import IpsDetailAdmin from "@/components/IpsDetailAdmin";

interface Props {
  params: {
    id: string;
  };
}

export default function IpsDetailPage({ params }: Props) {
  const { id } = params;

  return (
    <div className="min-h-screen bg-[#ECF6FF] dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-800 dark:text-white">
          Detalle de IPS
        </h1>

        <IpsDetailAdmin id={id} />
      </div>
    </div>
  );
}
