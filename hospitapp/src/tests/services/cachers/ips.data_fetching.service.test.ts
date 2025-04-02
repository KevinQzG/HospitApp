// import { Container } from "inversify";
// import * as cacheModule from "next/cache"; // Import for mocking unstable_cache
// import { TYPES } from "@/adapters/types";
// import DBAdapter from "@/adapters/db.adapter";
// import SpecialtyServiceAdapter from "@/adapters/services/specialty.service.adapter";
// import EpsServiceAdapter from "@/adapters/services/eps.service.adapter";
// import { getSearchIpsCachedProps, SearchFormClientProps } from "@/services/cachers/data_caching.service";
// import { ENV } from "@/config/env";

// // Mock the CONTAINER (global export) since it's imported directly
// jest.mock("@/adapters/container", () => {
//   return new Container();
// });

// describe("getSearchIpsCachedProps", () => {
//   let mockDbAdapter: jest.Mocked<DBAdapter>;
//   let mockEpsService: jest.Mocked<EpsServiceAdapter>;
//   let mockSpecialtyService: jest.Mocked<SpecialtyServiceAdapter>;
//   let mockCache: jest.Mock; // Mock for unstable_cache

//   const MOCK_SPECIALTIES = [
//     { _id: "67b3e98bb1ae5d9e47ae7a08", name: "ENFERMERÍA" },
//   ];
//   const MOCK_EPS = [
//     { _id: "67b3e98bb1ae5d9e47ae7a09", name: "SALUD TOTAL" },
//   ];

//   beforeAll(() => {
//     // Mock unstable_cache
//     mockCache = jest.fn().mockImplementation((fn) => fn); // Pass-through for simplicity
//     jest.spyOn(cacheModule, "unstable_cache").mockImplementation(mockCache);

//     // Create mock implementations
//     mockDbAdapter = {
//       connect: jest.fn().mockResolvedValue({}), // Mock implementation for connect
//       close: jest.fn().mockResolvedValue(undefined),
//     } as jest.Mocked<DBAdapter>;

//     mockEpsService = {
//       getAllEps: jest.fn().mockResolvedValue(MOCK_EPS),
//     } as jest.Mocked<EpsServiceAdapter>;

//     mockSpecialtyService = {
//       getAllSpecialties: jest.fn().mockResolvedValue(MOCK_SPECIALTIES),
//     } as jest.Mocked<SpecialtyServiceAdapter>;

//     // Bind mocks to the CONTAINER
//     const CONTAINER = require("@/adapters/container").default; // Access mocked CONTAINER
//     CONTAINER.bind(TYPES.DBAdapter).toConstantValue(mockDbAdapter as DBAdapter);
//     CONTAINER.bind(TYPES.EpsServiceAdapter).toConstantValue(mockEpsService);
//     CONTAINER.bind(TYPES.SpecialtyServiceAdapter).toConstantValue(mockSpecialtyService);
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   afterAll(() => {
//     jest.restoreAllMocks(); // Restore original implementations
//   });

//   it("should fetch and return specialties and EPS with successful resolution", async () => {
//     const result = await getSearchIpsCachedProps();

//     // Verify service calls
//     expect(mockSpecialtyService.getAllSpecialties).toHaveBeenCalled();
//     expect(mockEpsService.getAllEps).toHaveBeenCalled();

//     // Verify database connection closed
//     expect(mockDbAdapter.close).toHaveBeenCalled();

//     // Verify result
//     expect(result).toEqual({
//       specialties: MOCK_SPECIALTIES,
//       eps: MOCK_EPS,
//     });

//     // Verify cache configuration
//     expect(cacheModule.unstable_cache).toHaveBeenCalledWith(
//       expect.any(Function),
//       ["search-config"],
//       { revalidate: ENV.CACHE_TTL, tags: ["search-config"] }
//     );
//   });

//   it("should handle empty specialties and EPS lists", async () => {
//     mockSpecialtyService.getAllSpecialties.mockResolvedValueOnce([]);
//     mockEpsService.getAllEps.mockResolvedValueOnce([]);

//     const result = await getSearchIpsCachedProps();

//     expect(mockSpecialtyService.getAllSpecialties).toHaveBeenCalled();
//     expect(mockEpsService.getAllEps).toHaveBeenCalled();
//     expect(mockDbAdapter.close).toHaveBeenCalled();
//     expect(result).toEqual({
//       specialties: [],
//       eps: [],
//     });
//   });

//   it("should throw an error with message if specialty service fails", async () => {
//     const errorMessage = "Specialty fetch error";
//     mockSpecialtyService.getAllSpecialties.mockRejectedValueOnce(new Error(errorMessage));

//     await expect(getSearchIpsCachedProps()).rejects.toThrow(`Error fetching page props: ${errorMessage}`);
//     expect(mockDbAdapter.close).toHaveBeenCalled(); // Ensure cleanup happens even on error
//   });

//   it("should throw an error with message if EPS service fails", async () => {
//     const errorMessage = "EPS fetch error";
//     mockEpsService.getAllEps.mockRejectedValueOnce(new Error(errorMessage));

//     await expect(getSearchIpsCachedProps()).rejects.toThrow(`Error fetching page props: ${errorMessage}`);
//     expect(mockDbAdapter.close).toHaveBeenCalled();
//   });

//   it("should throw a generic error if an unknown error occurs", async () => {
//     mockSpecialtyService.getAllSpecialties.mockRejectedValueOnce("unknown error"); // Non-Error object

//     await expect(getSearchIpsCachedProps()).rejects.toThrow("Error fetching page props");
//     expect(mockDbAdapter.close).toHaveBeenCalled();
//   });

//   it("should use cached result on subsequent calls if cache is hit", async () => {
//     // Reset mocks to simulate fresh state
//     jest.clearAllMocks();

//     // Mock cache to return a cached value instead of calling the function
//     mockCache.mockResolvedValueOnce({
//       specialties: [{ _id: "cached", name: "CACHED_SPECIALTY" }],
//       eps: [{ _id: "cached", name: "CACHED_EPS" }],
//     });

//     const result = await getSearchIpsCachedProps();

//     // Verify services were NOT called (cache hit)
//     expect(mockSpecialtyService.getAllSpecialties).not.toHaveBeenCalled();
//     expect(mockEpsService.getAllEps).not.toHaveBeenCalled();
//     expect(mockDbAdapter.close).not.toHaveBeenCalled();

//     expect(result).toEqual({
//       specialties: [{ _id: "cached", name: "CACHED_SPECIALTY" }],
//       eps: [{ _id: "cached", name: "CACHED_EPS" }],
//     });
//   });
// });