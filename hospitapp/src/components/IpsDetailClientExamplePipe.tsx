"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	MapPin,
	Mail,
	Phone,
	Home,
	ArrowLeft,
	Hospital,
	Stethoscope,
	UserCheck,
	Pencil,
	Trash2,
	Plus,
  Star,
} from "lucide-react";
import mapboxgl from "mapbox-gl";
import Image from "next/image";
import { LookIpsResponse } from "@/app/api/search_ips/ips/route";
import { IpsResponse } from "@/models/ips.interface";
import { ReviewResponse } from "@/models/review.interface";
import { ChevronLeft, ChevronRight } from "lucide-react";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY as string;

type IpsDetailClientProps = {
	ipsData: IpsResponse;
	initialReviewsResult: {
		reviews: ReviewResponse[];
		pagination?: {
			total: number;
			totalPages: number;
			page: number;
			pageSize: number;
		};
	} | null;
};

type ReviewsResponse = {
	success: boolean;
	error?: string;
	data?: {
		result: ReviewResponse[];
		pagination: {
			total: number;
			totalPages: number;
			page: number;
			pageSize: number;
		};
	};
};

type UserSession = {
	email: string;
} | null;

export default function IpsDetailClient({
	ipsData,
	initialReviewsResult,
}: IpsDetailClientProps) {
	const router = useRouter();
	const [viewMode, setViewMode] = useState<"details" | "map">("details");
	const [userSession, setUserSession] = useState<UserSession>(null);

	// Fetch user session on mount
	useEffect(() => {
		const fetchUserSession = async () => {
			try {
				const response = await fetch(`/api/v1.0.0/auth/session`, {
					method: "GET",
					credentials: "include", // Include cookies for session token
				});
				if (response.ok) {
					const data = await response.json();
					if (data.success) {
						setUserSession({ email: data.email });
					} else {
						setUserSession(null); // Invalid session
					}
				} else {
					setUserSession(null); // No valid session
				}
			} catch (err) {
				console.error("Failed to fetch user session:", err);
				setUserSession(null);
			}
		};

		fetchUserSession();
	}, []);

	const formatEpsName = (name: string): string => {
		console.log("Nombre EPS original:", name);

		let formattedName = name.replace(/\bCrus Blanca\b/i, "Cruz Blanca");
		formattedName = formattedName
			.replace(/\bEPS-S\b|\bEPS-C\b/g, "EPS")
			.trim();
		formattedName = formattedName.toUpperCase();

		// Log para depurar el nombre formateado
		console.log("Nombre EPS formateado:", formattedName);
		return formattedName;
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans flex flex-col transition-colors duration-300">
			<header className="bg-white dark:bg-gray-800 shadow-lg rounded-b-xl">
				<div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 sm:py-6">
					<div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
						<div className="flex items-center space-x-3">
							<Hospital className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
							<h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white whitespace-normal break-words max-w-xs sm:max-w-none">
								{ipsData.name}
							</h1>
						</div>
						<div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
							<Link
								href="/"
								className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg"
							>
								<Home className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
								Inicio
							</Link>
							<Link
								href="/results"
								className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg"
							>
								<ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
								Resultados
							</Link>
						</div>
					</div>
				</div>
			</header>

			<main className="flex-grow max-w-6xl mx-auto px-4 py-6 sm:px-6 sm:py-12 w-full">
				<div className="flex flex-col sm:flex-row justify-end items-center mb-6 sm:mb-8">
					<div className="flex space-x-2 sm:space-x-4">
						<button
							onClick={() => setViewMode("details")}
							className={`px-2 py-1 sm:px-3 sm:py-2 rounded-lg font-medium transition-all text-xs sm:text-base ${
								viewMode === "details"
									? "bg-blue-700 text-white shadow-sm dark:bg-blue-600"
									: "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
							}`}
						>
							Detalles
						</button>
						<button
							onClick={() => setViewMode("map")}
							className={`px-2 py-1 sm:px-3 sm:py-2 rounded-lg font-medium transition-all text-xs sm:text-base ${
								viewMode === "map"
									? "bg-blue-700 text-white shadow-sm dark:bg-blue-600"
									: "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
							}`}
						>
							Mapa
						</button>
					</div>
				</div>

				{viewMode === "details" ? (
					<DetailsView
						ipsData={ipsData}
						formatEpsName={formatEpsName}
						initialReviewsResult={initialReviewsResult}
						userSession={userSession}
					/>
				) : (
					<MapView ipsData={ipsData} router={router} />
				)}
			</main>
		</div>
	);
}

function DetailsView({
	ipsData,
	formatEpsName,
	initialReviewsResult,
	userSession,
}: {
	ipsData: NonNullable<LookIpsResponse["data"]>;
	initialReviewsResult: IpsDetailClientProps["initialReviewsResult"];
	userSession: UserSession;
	formatEpsName: (name: string) => string;
}) {
	const router = useRouter();
	const GOOGLE_MAPS_URL = `https://www.google.com/maps?q=${ipsData.location.coordinates[1]},${ipsData.location.coordinates[0]}`;
	const WAZE_URL = `https://waze.com/ul?ll=${ipsData.location.coordinates[1]},${ipsData.location.coordinates[0]}&navigate=yes`;

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [reviewsResult, setReviewsResult] = useState(initialReviewsResult);
	const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
	const [editRating, setEditRating] = useState<number>(0);
	const [editComments, setEditComments] = useState<string>("");
	const [showAddReviewForm, setShowAddReviewForm] = useState(false);
	const [newRating, setNewRating] = useState<number>(0);
	const [newComments, setNewComments] = useState<string>("");

	const fetchReviewsPage = async (page: number) => {
		// If requesting page 1 and we already have initial data, skip the fetch
		if (
			page === 1 &&
			initialReviewsResult &&
			reviewsResult?.pagination?.page === 1
		) {
			setReviewsResult(initialReviewsResult);
			return;
		}

		setLoading(true);
		setError(null);
		try {
			const response = await fetch(
				`/api/v1.0.0/reviews/get/all/pagination`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						page,
						pageSize: reviewsResult?.pagination?.pageSize || 5, // Use initial page size
						filters: [{ field: "ips", value: ipsData._id }], // Filter by IPS ID
						sorts: [
							{ field: "rating", direction: -1 },
							{ field: "updatedAt", direction: 1 },
						],
					}),
				}
			);

			if (!response.ok) {
				const errorData: ReviewsResponse = await response.json();
				throw new Error(errorData.error || "Failed to fetch reviews");
			}

			const data: ReviewsResponse = await response.json();
			if (data.data) {
				setReviewsResult({
					reviews: data.data.result,
					pagination: data.data.pagination,
				});
			}
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "An unknown error occurred"
			);
		} finally {
			setLoading(false);
		}
	};

	const handlePageChange = (newPage: number) => {
		if (
			newPage < 1 ||
			newPage > (reviewsResult?.pagination?.totalPages || 1) ||
			newPage === reviewsResult?.pagination?.page
		) {
			return;
		}
		fetchReviewsPage(newPage);
	};

	const handleDeleteReview = async (reviewId: string) => {
		if (!userSession) return;

		try {
			const response = await fetch(`/api/v1.0.0/reviews/delete`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					id: reviewId,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to delete review");
			}

			// Update reviews state immediately after deletion
			window.alert("¡Reseña " + reviewId + " eliminada correctamente!");

			fetchReviewsPage(reviewsResult?.pagination?.page || 1);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to delete review"
			);
		}
	};

	const handleEditReviewStart = (review: ReviewResponse) => {
		setEditingReviewId(review._id);
		setEditRating(review.rating);
		setEditComments(review.comments);
	};

	const handleEditReviewSave = async (reviewId: string) => {
		if (!userSession) return;

		try {
			const response = await fetch(`/api/v1.0.0/reviews/edit`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					id: reviewId,
					rating: editRating,
					comments: editComments,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to update review");
			}

			window.alert("¡Reseña " + reviewId + " editada correctamente!");
			setEditingReviewId(null);
			await fetchReviewsPage(reviewsResult?.pagination?.page || 1);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to update review"
			);
		}
	};

	const handleAddReview = async () => {
		if (!userSession) {
			router.push("/login");
			return;
		}

		if (!newRating || !newComments) {
			setError("Rating and comments are required");
			return;
		}

		try {
			const response = await fetch(`/api/v1.0.0/reviews/create`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					ips: ipsData._id,
					rating: newRating,
					comments: newComments,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to create review");
			}

			window.alert("¡Reseña creada correctamente!");
			setNewRating(0);
			setNewComments("");
			setShowAddReviewForm(false);
			await fetchReviewsPage(reviewsResult?.pagination?.page || 1);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to create review"
			);
		}
	};

	return (
		<div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
			<section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-all duration-300">
				<h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center">
					<Hospital className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />
					Información General
				</h2>
				<ul className="space-y-4 sm:space-y-5 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
					<li className="flex items-center">
						<MapPin
							size={18}
							className="mr-2 sm:mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0"
						/>
						<span>
							{ipsData.department}, {ipsData.town}
						</span>
					</li>
					<li className="flex items-center">
						<MapPin
							size={18}
							className="mr-2 sm:mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0"
						/>
						<span>{ipsData.address}</span>
					</li>
					{ipsData.phone && (
						<li className="flex items-center">
							<Phone
								size={18}
								className="mr-2 sm:mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0"
							/>
							<span>{ipsData.phone}</span>
						</li>
					)}
					{ipsData.email && (
						<li className="flex items-center">
							<Mail
								size={18}
								className="mr-2 sm:mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0"
							/>
							<span>{ipsData.email}</span>
						</li>
					)}
          {ipsData.rating && (
						<li className="flex items-center">
							<Star
								size={18}
								className="mr-2 sm:mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0"
							/>
              <span>Calificación: </span>
							<span>{ipsData.rating}</span>
						</li>
					)}
					{ipsData.level && (
						<li className="flex items-center">
							<span className="font-medium text-gray-900 dark:text-gray-200 mr-2">
								Nivel:
							</span>
							<span>{ipsData.level}</span>
						</li>
					)}
				</ul>
			</section>

			<section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-all duration-300">
				<h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
					Cómo llegar
				</h2>
				<nav aria-label="Opciones de navegación">
					<ul className="space-y-4">
						<li className="flex flex-col items-start">
							<a
								href={GOOGLE_MAPS_URL}
								target="_blank"
								rel="noopener noreferrer"
								className="flex justify-center items-center w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 p-4"
								aria-label="Abrir ubicación en Google Maps"
							>
								<Image
									src="/stock/GMaps.png"
									alt="Google Maps Icon"
									width={0}
									height={0}
									sizes="100vw"
									className="w-3/4 sm:w-full h-10 sm:h-12 object-contain"
								/>
							</a>
						</li>
						<li className="flex flex-col items-start">
							<a
								href={WAZE_URL}
								target="_blank"
								rel="noopener noreferrer"
								className="flex justify-center items-center w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 p-4"
								aria-label="Abrir ubicación en Waze"
							>
								<Image
									src="/stock/Waze.png"
									alt="Waze Icon"
									width={0}
									height={0}
									sizes="100vw"
									className="w-3/4 sm:w-full h-10 sm:h-12 object-contain"
								/>
							</a>
						</li>
					</ul>
				</nav>
			</section>

			{ipsData.eps && ipsData.eps.length > 0 && (
				<section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 md:col-span-2 hover:shadow-xl transition-all duration-300">
					<h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center">
						<UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />
						EPS Aceptadas
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						{ipsData.eps.map((eps) => (
							<div
								key={eps._id}
								className="flex items-center bg-blue-50 dark:bg-blue-900/50 border border-blue-100 dark:border-blue-800 rounded-lg p-3 hover:bg-blue-100 dark:hover:bg-blue-800 hover:shadow-sm transition-all duration-300"
							>
								<UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />
								<span className="text-sm font-medium text-gray-800 dark:text-gray-200">
									{formatEpsName(eps.name)}{" "}
									{/* Aplicamos el formato aquí */}
								</span>
							</div>
						))}
					</div>
				</section>
			)}

			{ipsData.specialties && ipsData.specialties.length > 0 && (
				<section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 md:col-span-2 hover:shadow-xl transition-all duration-300">
					<h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center">
						<Stethoscope className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />
						Especialidades
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						{ipsData.specialties.map((spec) => (
							<div
								key={spec._id}
								className="flex items-center bg-blue-50 dark:bg-blue-900/50 border border-blue-100 dark:border-blue-800 rounded-lg p-3 hover:bg-blue-100 dark:hover:bg-blue-800 hover:shadow-sm transition-all duration-300"
							>
								<Stethoscope className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />
								<span className="text-sm font-medium text-gray-800 dark:text-gray-200">
									{spec.name}
								</span>
							</div>
						))}
					</div>
				</section>
			)}

			{/* Reviews Section */}
			<section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 md:col-span-2 hover:shadow-xl transition-all duration-300">
				<h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
					Reseñas
				</h2>
				{loading ? (
					<p className="text-gray-600 dark:text-gray-300">
						Cargando reseñas...
					</p>
				) : error ? (
					<p className="text-red-500">{error}</p>
				) : (
					<>
						<button
							onClick={() =>
								setShowAddReviewForm(!showAddReviewForm)
							}
							className="mb-4 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
						>
							<Plus className="w-4 h-4" />
							Agregar Reseña
						</button>

						{showAddReviewForm && (
							<div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
								<h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
									Nueva Reseña
								</h3>
								<div className="mb-2">
									<label className="block text-gray-700 dark:text-gray-300 mb-1">
										Calificación (1-5):
									</label>
									<input
										type="number"
										min="1"
										max="5"
										value={newRating}
										onChange={(e) =>
											setNewRating(Number(e.target.value))
										}
										className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
									/>
								</div>
								<div className="mb-2">
									<label className="block text-gray-700 dark:text-gray-300 mb-1">
										Comentarios:
									</label>
									<textarea
										value={newComments}
										onChange={(e) =>
											setNewComments(e.target.value)
										}
										className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
										rows={3}
									/>
								</div>
								<button
									onClick={handleAddReview}
									className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
								>
									Guardar
								</button>
							</div>
						)}

						{reviewsResult && reviewsResult.reviews.length > 0 ? (
							<>
								<p className="text-gray-600 dark:text-gray-300">
									{reviewsResult.pagination?.total} reseñas
								</p>
								{reviewsResult.reviews.map((review) => (
									<div
										key={review._id}
										className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
									>
										{editingReviewId === review._id ? (
											<div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
												<div className="mb-2">
													<label className="block text-gray-700 dark:text-gray-300 mb-1">
														Calificación (1-5):
													</label>
													<input
														type="number"
														min="1"
														max="5"
														value={editRating}
														onChange={(e) =>
															setEditRating(
																Number(
																	e.target
																		.value
																)
															)
														}
														className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
													/>
												</div>
												<div className="mb-2">
													<label className="block text-gray-700 dark:text-gray-300 mb-1">
														Comentarios:
													</label>
													<textarea
														value={editComments}
														onChange={(e) =>
															setEditComments(
																e.target.value
															)
														}
														className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
														rows={3}
													/>
												</div>
												<button
													onClick={() =>
														handleEditReviewSave(
															review._id
														)
													}
													className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
												>
													Guardar
												</button>
												<button
													onClick={() =>
														setEditingReviewId(null)
													}
													className="ml-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
												>
													Cancelar
												</button>
											</div>
										) : (
											<>
												<p className="text-gray-800 dark:text-gray-200 font-medium">
													<strong>Usuario:</strong>{" "}
													{review.userEmail ||
														"Anónimo"}
												</p>
												<p className="text-gray-600 dark:text-gray-300">
													<strong>
														Última actualización:
													</strong>{" "}
													{new Date(
														review.lastUpdated
													).toLocaleDateString()}
												</p>
												<p className="text-gray-600 dark:text-gray-300">
													<strong>
														Calificación:
													</strong>{" "}
													{review.rating}/5
												</p>
												<p className="text-gray-600 dark:text-gray-300">
													<strong>
														Comentarios:
													</strong>{" "}
													{review.comments}
												</p>
												{userSession &&
													userSession.email ===
														review.userEmail && (
														<div className="mt-2 flex gap-2">
															<button
																onClick={() =>
																	handleEditReviewStart(
																		review
																	)
																}
																className="flex items-center gap-1 px-2 py-1 text-sm text-blue-600 hover:bg-blue-100 dark:hover:bg-gray-700 rounded"
															>
																<Pencil className="w-4 h-4" />
																Editar
															</button>
															<button
																onClick={() =>
																	handleDeleteReview(
																		review._id
																	)
																}
																className="flex items-center gap-1 px-2 py-1 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-gray-700 rounded"
															>
																<Trash2 className="w-4 h-4" />
																Eliminar
															</button>
														</div>
													)}
											</>
										)}
									</div>
								))}

								{/* Pagination Controls */}
								{reviewsResult.pagination &&
									reviewsResult.pagination.totalPages > 1 && (
										<div className="flex justify-between items-center mt-6">
											<button
												onClick={() =>
													handlePageChange(
														(reviewsResult
															.pagination?.page ||
															1) - 1
													)
												}
												disabled={
													reviewsResult.pagination
														.page === 1 || loading
												}
												className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
													reviewsResult.pagination
														.page === 1 || loading
														? "text-gray-400 cursor-not-allowed"
														: "text-blue-600 hover:bg-blue-100 dark:hover:bg-gray-700"
												}`}
											>
												<ChevronLeft className="w-4 h-4" />
												Anterior
											</button>
											<p className="text-gray-600 dark:text-gray-300">
												Página{" "}
												{reviewsResult.pagination.page}{" "}
												de{" "}
												{
													reviewsResult.pagination
														.totalPages
												}
											</p>
											<button
												onClick={() =>
													handlePageChange(
														(reviewsResult
															.pagination?.page ||
															1) + 1
													)
												}
												disabled={
													reviewsResult.pagination
														.page ===
														reviewsResult.pagination
															.totalPages ||
													loading
												}
												className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
													reviewsResult.pagination
														.page ===
														reviewsResult.pagination
															.totalPages ||
													loading
														? "text-gray-400 cursor-not-allowed"
														: "text-blue-600 hover:bg-blue-100 dark:hover:bg-gray-700"
												}`}
											>
												Siguiente
												<ChevronRight className="w-4 h-4" />
											</button>
										</div>
									)}
							</>
						) : (
							<p className="text-gray-600 dark:text-gray-300">
								No hay reseñas disponibles para esta IPS.
							</p>
						)}
					</>
				)}
			</section>
		</div>
	);
}

function MapView({
	ipsData,
	router,
}: {
	ipsData: NonNullable<LookIpsResponse["data"]>;
	router: ReturnType<typeof useRouter>;
}) {
	const [distance, setDistance] = useState<number | null>(null);
	let userMarker: mapboxgl.Marker | null = null;

	useEffect(() => {
		const [hospitalLng, hospitalLat] = ipsData.location.coordinates;
		const initializedMap = new mapboxgl.Map({
			container: "map",
			style: "mapbox://styles/mapbox/streets-v12",
			center: [hospitalLng, hospitalLat],
			zoom: 12,
		});

		initializedMap.addControl(
			new mapboxgl.NavigationControl(),
			"bottom-right"
		);
		initializedMap.addControl(
			new mapboxgl.FullscreenControl(),
			"top-right"
		);

		const geolocate = new mapboxgl.GeolocateControl({
			positionOptions: { enableHighAccuracy: true },
			trackUserLocation: true,
			showUserLocation: false,
		});
		initializedMap.addControl(geolocate, "top-right");

		const hospitalMarkerElement = document.createElement("div");
		hospitalMarkerElement.innerHTML = `
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h2v-2h2v-2h-2V9h-2v3H9v2h2zm1-10c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" fill="#2563EB" stroke="#FFFFFF" stroke-width="1.5"/>
      </svg>
    `;

		const popupContent = document.createElement("div");
		popupContent.className = "popup-content";
		popupContent.innerHTML = `
      <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl max-w-sm border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-blue-600 dark:text-blue-400 cursor-pointer hover:underline mb-2">${
			ipsData.name
		}</h3>
        <p class="text-sm text-gray-600 dark:text-gray-300">${
			ipsData.address
		}, ${ipsData.town ?? ""}, ${ipsData.department ?? ""}</p>
      </div>
    `;
		popupContent.querySelector("h3")?.addEventListener("click", () => {
			router.push(`/ips-details/${encodeURIComponent(ipsData.name)}`);
		});

		new mapboxgl.Marker({ element: hospitalMarkerElement })
			.setLngLat([hospitalLng, hospitalLat])
			.setPopup(
				new mapboxgl.Popup({ offset: 25 }).setDOMContent(popupContent)
			)
			.addTo(initializedMap);

		const addRoute = (userLng: number, userLat: number) => {
			fetch(
				`https://api.mapbox.com/directions/v5/mapbox/driving/${userLng},${userLat};${hospitalLng},${hospitalLat}?geometries=geojson&access_token=${mapboxgl.accessToken}`
			)
				.then((response) => response.json())
				.then((data) => {
					if (data.routes && data.routes.length > 0) {
						const route = data.routes[0].geometry.coordinates;
						const routeDistance = data.routes[0].distance / 1000;
						setDistance(parseFloat(routeDistance.toFixed(2)));

						if (initializedMap.getSource("route")) {
							(
								initializedMap.getSource(
									"route"
								) as mapboxgl.GeoJSONSource
							).setData({
								type: "Feature",
								properties: {},
								geometry: {
									type: "LineString",
									coordinates: route,
								},
							});
						} else {
							initializedMap.addSource("route", {
								type: "geojson",
								data: {
									type: "Feature",
									properties: {},
									geometry: {
										type: "LineString",
										coordinates: route,
									},
								},
							});
							initializedMap.addLayer({
								id: "route",
								type: "line",
								source: "route",
								layout: {
									"line-join": "round",
									"line-cap": "round",
								},
								paint: {
									"line-color": "#2563EB",
									"line-width": 5,
									"line-opacity": 0.85,
								},
							});
						}
					}
				})
				.catch((error) =>
					console.error("Error fetching route:", error)
				);
		};

		const recenterMap = (userLng?: number, userLat?: number) => {
			const bounds = new mapboxgl.LngLatBounds();
			bounds.extend([hospitalLng, hospitalLat]);
			if (userLng && userLat) bounds.extend([userLng, userLat]);
			initializedMap.fitBounds(bounds, { padding: 50, duration: 1000 });
		};

		initializedMap.on("load", () => {
			initializedMap.resize();
			geolocate.trigger();
		});

		geolocate.on("geolocate", (e: GeolocationPosition) => {
			const userLng = e.coords.longitude;
			const userLat = e.coords.latitude;

			if (userMarker) {
				userMarker.setLngLat([userLng, userLat]);
			} else {
				const userMarkerElement = document.createElement("div");
				userMarkerElement.innerHTML = `
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#D73535" stroke="#FFFFFF" stroke-width="1.5"/>
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-2 2h4v6h-1v-2h-2v2h-1v-6z" fill="#FFFFFF"/>
          </svg>
        `;

				userMarker = new mapboxgl.Marker({ element: userMarkerElement })
					.setLngLat([userLng, userLat])
					.addTo(initializedMap);
			}

			recenterMap(userLng, userLat);
			addRoute(userLng, userLat);
		});

		const darkModeMediaQuery = window.matchMedia(
			"(prefers-color-scheme: dark)"
		);
		const handleDarkModeChange = (e: MediaQueryListEvent) => {
			initializedMap.setStyle(
				e.matches
					? "mapbox://styles/mapbox/dark-v10"
					: "mapbox://styles/mapbox/streets-v12"
			);
		};
		darkModeMediaQuery.addEventListener("change", handleDarkModeChange);
		if (darkModeMediaQuery.matches) {
			initializedMap.setStyle("mapbox://styles/mapbox/dark-v10");
		}

		return () => {
			initializedMap.remove();
			if (userMarker) userMarker.remove();
			darkModeMediaQuery.removeEventListener(
				"change",
				handleDarkModeChange
			);
		};
	}, [ipsData, router]);

	return (
		<div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
			<div id="map" className="w-full h-full" />
			{distance !== null && (
				<div className="absolute top-4 left-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 flex items-center space-x-2">
					<MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
					<span className="text-sm font-medium text-gray-800 dark:text-gray-200">
						{distance} km
					</span>
				</div>
			)}
		</div>
	);
}
