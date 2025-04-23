"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

type Review = {
	_id: string;
	user: string;
	ips: string;
	rating: number;
	comments: string;
	createdAt: string;
	lastUpdated: string;
	userEmail: string;
	ipsName: string;
};

type ReviewsResponse = {
	success: boolean;
	data?: {
		result: Review[];
		pagination: {
			total: number;
			totalPages: number;
			page: number;
			pageSize: number;
		};
	};
	error?: string;
};

type AuthResponse = {
	success: boolean;
	error?: string;
};

export default function AdminReviewsPage() {
	const router = useRouter();
	const [reviews, setReviews] = useState<Review[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [pagination, setPagination] = useState({
		total: 0,
		totalPages: 1,
		page: 1,
		pageSize: 10,
	});

	// Validate ADMIN access and fetch reviews on mount
	useEffect(() => {
		const verifyAdminAndFetchReviews = async () => {
			try {
				// Step 1: Verify ADMIN role
				const authResponse = await fetch(
					"/api/v1.0.0/auth/verification",
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						credentials: "include", // Include cookies for session
						body: JSON.stringify({
							authenticationNeeded: true,
							authenticationRoles: ["ADMIN"],
						}),
					}
				);

				const authData: AuthResponse = await authResponse.json();
				if (!authResponse.ok || !authData.success) {
					router.push("/login");
					return;
				}

				// Step 2: Fetch reviews if ADMIN
				const reviewsResponse = await fetch(
					"/api/v1.0.0/reviews/get/all/pagination",
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						credentials: "include",
						body: JSON.stringify({
							page: 1,
							pageSize: 10,
							sorts: [{ field: "rating", direction: -1 }],
						}),
					}
				);

				if (!reviewsResponse.ok) {
					const errorData: ReviewsResponse =
						await reviewsResponse.json();
					throw new Error(
						errorData.error || "Failed to fetch reviews"
					);
				}

				const reviewsData: ReviewsResponse =
					await reviewsResponse.json();
				if (reviewsData.success && reviewsData.data) {
					setReviews(reviewsData.data.result);
					setPagination(reviewsData.data.pagination);
				}
			} catch (err) {
				setError(
					err instanceof Error
						? err.message
						: "An unknown error occurred"
				);
			} finally {
				setLoading(false);
			}
		};

		verifyAdminAndFetchReviews();
	}, [router]);

	// Handle review deletion
	const handleDeleteReview = async (reviewId: string) => {
		const confirmDelete = window.confirm(
			"¿Estás seguro de que deseas eliminar esta reseña? Esta acción no se puede deshacer."
		);

		// Proceed only if the user clicks "OK"
		if (!confirmDelete) {
			return; // Abort deletion if "Cancel" is clicked
		}
		try {
			const response = await fetch(
				"/api/v1.0.0/reviews/delete",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify({ id: reviewId }),
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to delete review");
			}

			// Update local state to remove the deleted review
			setReviews((prevReviews) =>
				prevReviews.filter((review) => review._id !== reviewId)
			);
			setPagination((prev) => ({
				...prev,
				total: prev.total - 1,
				totalPages: Math.ceil((prev.total - 1) / prev.pageSize),
			}));
			window.alert("¡Reseña " + reviewId + " eliminada correctamente!");
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to delete review"
			);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
				<p className="text-gray-600 dark:text-gray-300">Loading...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
				<p className="text-red-500">{error}</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
			<div className="max-w-6xl mx-auto">
				<h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
					Admin Reviews
				</h1>
				{reviews.length > 0 ? (
					<div className="overflow-x-auto">
						<table className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg">
							<thead>
								<tr className="bg-gray-100 dark:bg-gray-700 text-left text-gray-600 dark:text-gray-300">
									<th className="p-4">ID</th>
									<th className="p-4">User Email</th>
									<th className="p-4">IPS Name</th>
									<th className="p-4">Rating</th>
									<th className="p-4">Comments</th>
									<th className="p-4">Created At</th>
									<th className="p-4">Last Updated</th>
									<th className="p-4">Actions</th>
								</tr>
							</thead>
							<tbody>
								{reviews.map((review) => (
									<tr
										key={review._id}
										className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
									>
										<td className="p-4 text-gray-800 dark:text-gray-200">
											{review._id}
										</td>
										<td className="p-4 text-gray-800 dark:text-gray-200">
											{review.userEmail}
										</td>
										<td className="p-4 text-gray-800 dark:text-gray-200">
											{review.ipsName}
										</td>
										<td className="p-4 text-gray-800 dark:text-gray-200">
											{review.rating}
										</td>
										<td className="p-4 text-gray-800 dark:text-gray-200">
											{review.comments}
										</td>
										<td className="p-4 text-gray-800 dark:text-gray-200">
											{new Date(
												review.createdAt
											).toLocaleString()}
										</td>
										<td className="p-4 text-gray-800 dark:text-gray-200">
											{new Date(
												review.lastUpdated
											).toLocaleString()}
										</td>
										<td className="p-4">
											<button
												onClick={() =>
													handleDeleteReview(
														review._id
													)
												}
												className="flex items-center gap-1 px-2 py-1 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-gray-600 rounded"
											>
												<Trash2 className="w-4 h-4" />
												Delete
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<p className="text-gray-600 dark:text-gray-300">
						No reviews found.
					</p>
				)}
				<div className="mt-4 text-gray-600 dark:text-gray-300">
					Total Reviews: {pagination.total} | Page {pagination.page}{" "}
					of {pagination.totalPages}
				</div>
			</div>
		</div>
	);
}
