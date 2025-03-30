import { getSearchIpsCachedProps } from "@/services/search_ips/data_caching.service";
import AdminDashboardClient from "@/components/AdminDashboardClient";

interface IpsResult {
  town?: string;
  // Add other properties from your API response as needed
  [key: string]: unknown; // This allows for additional properties while maintaining type safety
}

interface ApiResponse {
  data: IpsResult[];
  total?: number;
  // Add other properties from your API response as needed
}

export default async function AdminDashboardPage({ 
  searchParams 
}: { 
  searchParams: { page?: string } 
}) {
  const { eps, specialties } = await getSearchIpsCachedProps();

  const currentPage = parseInt(searchParams.page || "1", 10);
  const pageSize = 10;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  const res = await fetch(`${apiUrl}/search_ips/filter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      coordinates: [-75.5849, 6.1816],
      "max_distance": 20000, // Keeping snake_case for API compatibility
      page: currentPage,
      "page_size": pageSize,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`API request failed with status ${res.status}`);
  }

  const data: ApiResponse = await res.json();
  const towns = Array.from(
    new Set(data.data.map((ips) => ips.town || "Sin municipio"))
  ).filter(Boolean) as string[];

  return (
    <AdminDashboardClient
      eps={eps}
      specialties={specialties}
      towns={towns}
      initialData={data.data}
      totalResults={data.total || 0}
      currentPage={currentPage}
      pageSize={pageSize}
    />
  );
}