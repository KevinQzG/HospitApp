import { getSearchIpsCachedProps } from "@/services/search_ips/data_caching.service";
import AdminDashboardClient from "@/components/AdminDashboardClient";

interface IpsResult {
  town?: string;
  [key: string]: unknown;
}

interface ApiResponse {
  success: boolean;
  data: IpsResult[];
  total: number;
}

// Definimos una interfaz para el cuerpo de la solicitud
interface SearchRequestBody {
  page: number;
  pageSize: number;
  sort: string;
  town?: string;
  epsNames?: string[];
  specialties?: string[];
  name?: string;
}

export default async function AdminIpsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; town?: string; eps?: string; specialties?: string; name?: string }>;
}) {
  const { eps: epsList, specialties: specialtiesList } = await getSearchIpsCachedProps();

  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams.page || "1", 10);
  const selectedTown = resolvedSearchParams.town || "";
  const selectedEps = resolvedSearchParams.eps ? resolvedSearchParams.eps.split(",") : [];
  const selectedSpecialties = resolvedSearchParams.specialties ? resolvedSearchParams.specialties.split(",") : [];
  const searchName = resolvedSearchParams.name || "";
  const pageSize = 10;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL no está definido");
  }

  // Obtener todos los towns
  const townsRes = await fetch(`${apiUrl}/search_ips/filter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      page: 1,
      "page_size": 20000,
      sort: "town",
    }),
    cache: "force-cache",
  });

  if (!townsRes.ok) {
    throw new Error(`La solicitud a la API de towns falló con estado ${townsRes.status}`);
  }

  const townsData: ApiResponse = await townsRes.json();
  const towns = Array.from(
    new Set(townsData.data.map((ips) => ips.town || "Sin municipio"))
  )
    .filter(Boolean)
    .sort() as string[];

  // Obtener resultados paginados con filtros
  const requestBody: SearchRequestBody = {
    page: currentPage,
    pageSize: pageSize,
    sort: "town",
  };

  if (selectedTown) requestBody.town = selectedTown;
  if (selectedEps.length > 0) requestBody.epsNames = selectedEps;
  if (selectedSpecialties.length > 0) requestBody.specialties = selectedSpecialties;
  if (searchName) requestBody.name = searchName;

  // Convertimos el cuerpo de la solicitud al formato esperado por la API (epsNames -> eps_names)
  const apiRequestBody: Partial<typeof requestBody> & { page_size: number; eps_names?: string[] } = {
    ...requestBody,
    "page_size": requestBody.pageSize,
    "eps_names": requestBody.epsNames,
  };
  delete apiRequestBody.pageSize;
  delete apiRequestBody.epsNames;

  const res = await fetch(`${apiUrl}/search_ips/filter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(apiRequestBody),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`La solicitud a la API falló con estado ${res.status}`);
  }

  const data: ApiResponse = await res.json();

  return (
    <AdminDashboardClient
      eps={epsList}
      specialties={specialtiesList}
      towns={towns}
      initialData={data.data}
      totalResults={data.total}
      currentPage={currentPage}
      pageSize={pageSize}
    />
  );
}