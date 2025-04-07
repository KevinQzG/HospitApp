import { Container } from "inversify";
import * as containerModule from "@/adapters/container"; // Import for mocking CONTAINER
import { TYPES } from "@/adapters/types";
import type IpsServiceAdapter from "@/adapters/services/ips.service.adapter";
import {
	getIpsProps,
	getIpsPropsWithReviewsPagination,
} from "@/services/cachers/ips.data_fetching.service";
import { IpsResponse } from "@/models/ips.interface";
import { ReviewResponse } from "@/models/review.interface";

// Mock the CONTAINER
jest.mock("@/adapters/container", () => {
	return new Container();
});

describe("IPS Props Fetching Functions", () => {
	let mockIpsService: jest.Mocked<IpsServiceAdapter>;
	const MOCK_IPS_RES: IpsResponse = {
		_id: "67b3e98bb1ae5d9e47ae7a07",
		name: "ESE HOSPITAL VENANCIO DIAZ DIAZ",
		department: "ANTIOQUIA",
		town: "SABANETA",
		address: "KR 46B # 77 SUR 36",
		phone: 2889701,
		email: "GERENCIA@HOSPITALSABANETA.GOV.CO",
		location: {
			type: "Point",
			coordinates: [-75.6221158, 6.1482081],
		},
		level: 1,
		distance: 2415.089412549286,
	};

	const MOCK_REVIEW_RES: ReviewResponse[] = [
		{
			_id: "67b3e98bb1ae5d9e47ae7a08",
			user: "67b3e98bb1ae5d9e47ae7a07",
			ips: "67b3e98bb1ae5d9e47ae7a06",
			rating: 4,
			comments: "Great service!",
			createdAt: "2025-04-06T12:00:00.000Z",
			lastUpdated: "2025-04-06T12:05:00.000Z",
		},
	];

	beforeAll(() => {
		// Create mock IpsServiceAdapter
		mockIpsService = {
			getIpsByName: jest.fn().mockResolvedValue(MOCK_IPS_RES),
			getIpsByNameWithReviewsPagination: jest.fn().mockResolvedValue({
				ips: MOCK_IPS_RES,
				reviewsResult: {
					reviews: MOCK_REVIEW_RES,
					total: 1,
				},
			}),
			filterIpsWithPagination: jest.fn(), // Not used here but included for completeness
			filterIps: jest.fn().mockResolvedValue([]), // Mock implementation for filterIps
			getIpsByNameWithReviews: jest.fn().mockResolvedValue({
				ips: MOCK_IPS_RES,
				reviewsResult: MOCK_REVIEW_RES,
			}), // Mock implementation for getIpsByNameWithReviews
		};

		// Bind mock to CONTAINER
		const CONTAINER = containerModule.default as Container;
		CONTAINER.bind<IpsServiceAdapter>(
			TYPES.IpsServiceAdapter
		).toConstantValue(mockIpsService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	afterAll(() => {
		jest.restoreAllMocks(); // Restore original CONTAINER
	});

	describe("getIpsProps", () => {
		it("should retrieve IPS by name and return transformed response", async () => {
			const name = "ESE HOSPITAL VENANCIO DIAZ DIAZ";
			const result = await getIpsProps({ name });

			expect(mockIpsService.getIpsByName).toHaveBeenCalledWith(name);
			expect(result).toEqual(MOCK_IPS_RES);
		});

		it("should return null if IPS is not found", async () => {
			const name = "non_existent_name";
			mockIpsService.getIpsByName.mockResolvedValueOnce(null);

			const result = await getIpsProps({ name });

			expect(mockIpsService.getIpsByName).toHaveBeenCalledWith(name);
			expect(result).toBeNull();
		});

		it("should throw original error if service throws an Error", async () => {
			const name = "error_name";
			const error = new Error("DB error");
			mockIpsService.getIpsByName.mockRejectedValueOnce(error);

			await expect(getIpsProps({ name })).rejects.toThrow(error);
			expect(mockIpsService.getIpsByName).toHaveBeenCalledWith(name);
		});

		it("should throw generic error if service throws non-Error", async () => {
			const name = "unknown_error_name";
			mockIpsService.getIpsByName.mockRejectedValueOnce("unknown error");

			await expect(getIpsProps({ name })).rejects.toThrow(
				"Error fetching page props"
			);
			expect(mockIpsService.getIpsByName).toHaveBeenCalledWith(name);
		});
	});

	describe("getIpsPropsWithReviews", () => {
		it("should retrieve IPS and its reviews", async () => {
			const name = "ESE HOSPITAL VENANCIO DIAZ DIAZ";
			const reviewsPage = 1;
			const reviewsPageSize = 10;

			const result = await getIpsPropsWithReviewsPagination({
				name,
				reviewsPage,
				reviewsPageSize,
			});

			expect(
				mockIpsService.getIpsByNameWithReviewsPagination
			).toHaveBeenCalledWith(
				name,
				reviewsPage,
				reviewsPageSize,
				undefined
			);
			expect(result).toEqual({
				ips: MOCK_IPS_RES,
				reviewsResult: {
					reviews: MOCK_REVIEW_RES,
					total: 1,
				},
			});
		});

		it("should return null IPS and empty reviews if IPS not found", async () => {
			const name = "non_existent_name";
			mockIpsService.getIpsByNameWithReviewsPagination.mockResolvedValueOnce(
				{
					ips: null,
					reviewsResult: { reviews: [], total: 0 },
				}
			);

			const result = await getIpsPropsWithReviewsPagination({
				name,
				reviewsPage: 1,
				reviewsPageSize: 10,
			});

			expect(
				mockIpsService.getIpsByNameWithReviewsPagination
			).toHaveBeenCalledWith(name, 1, 10, undefined);
			expect(result).toEqual({
				ips: null,
				reviewsResult: { reviews: [], total: 0 },
			});
		});

		it("should throw original error if service throws an Error", async () => {
			const name = "error_name";
			const error = new Error("DB error");
			mockIpsService.getIpsByNameWithReviewsPagination.mockRejectedValueOnce(
				error
			);

			await expect(
				getIpsPropsWithReviewsPagination({
					name,
					reviewsPage: 1,
					reviewsPageSize: 10,
				})
			).rejects.toThrow(error);
			expect(
				mockIpsService.getIpsByNameWithReviewsPagination
			).toHaveBeenCalledWith(name, 1, 10, undefined);
		});

		it("should throw generic error if service throws non-Error", async () => {
			const name = "unknown_error_name";
			mockIpsService.getIpsByNameWithReviewsPagination.mockRejectedValueOnce(
				"unknown error"
			);

			await expect(
				getIpsPropsWithReviewsPagination({
					name,
					reviewsPage: 1,
					reviewsPageSize: 10,
				})
			).rejects.toThrow("Error fetching page props");
			expect(
				mockIpsService.getIpsByNameWithReviewsPagination
			).toHaveBeenCalledWith(name, 1, 10, undefined);
		});
	});
});
