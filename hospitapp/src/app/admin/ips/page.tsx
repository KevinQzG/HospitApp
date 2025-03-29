import { getSearchIpsCachedProps } from "@/services/search_ips/data_caching.service";
import SearchFormClient from "@/components/SearchFormClient";
import IpsListAdmin from "@/components/IpsListAdmin";
import { UserCircle } from "lucide-react";

export default async function AdminDashboardPage() {
  const { eps, specialties } = await getSearchIpsCachedProps();

  return (
    <div className="min-h-screen bg-[#ECF6FF] dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto py-10 px-6">
        <div className="flex items-center justify-center gap-4 mb-8">
          <UserCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-3xl font-bold text-center text-blue-800 dark:text-white">
            ¡Hola Admin! Gestiona las IPS fácilmente
          </h1>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          <SearchFormClient eps={eps} specialties={specialties} />
        </div>

        <div className="max-w-7xl mx-auto">
          <IpsListAdmin />
        </div>
      </div>
    </div>
  );
}
