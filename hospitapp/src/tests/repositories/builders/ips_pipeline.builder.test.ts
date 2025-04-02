import { PipelineStage } from "@/repositories/builders/pipeline.interface";
import { IpsPipelineBuilder } from "@/repositories/builders/ips_pipeline.builder";

describe("IpsPipelineBuilder", () => {
	const TEST_COORDS = [-75.6381, 6.1334];
	const MAX_DISTANCE = 5000;
	const SPECIALTIES = ["CARDIOLOGY", "NEUROLOGY"];
	const EPS_NAMES = ["EPS_1", "EPS_2"];
	const PAGE = 2;
	const PAGE_SIZE = 10;

	let pipeline: PipelineStage[];

	it("should build basic geo query pipeline", () => {
		pipeline = new IpsPipelineBuilder()
			.addGeoStage(TEST_COORDS[0], TEST_COORDS[1], MAX_DISTANCE)
			.build();

		expect(pipeline).toHaveLength(1);
		expect(pipeline[0]).toMatchObject({
			$geoNear: {
				near: {
					type: "Point",
					coordinates: TEST_COORDS,
				},
				maxDistance: MAX_DISTANCE,
				distanceField: "distance",
				spherical: true,
			},
		});
	});

	it("should add specialty filters when provided", () => {
		pipeline = new IpsPipelineBuilder()
			.addGeoStage(TEST_COORDS[0], TEST_COORDS[1], MAX_DISTANCE)
			.matchesSpecialties(SPECIALTIES)
			.build();

		// The pipeline should include the geo stage (1) plus 4 stages added by matchesSpecialties
		expect(pipeline).toHaveLength(5);
		// Stage 1 should be the first $lookup from specialtyLookup.
		expect(pipeline[1]).toMatchObject({
			$lookup: {
				from: "IPS_Specialty",
				localField: "_id",
				foreignField: "ips_id",
				as: "specialties",
			},
		});
		// Stage 3 should be the $match filtering on specialty_details.name.
		expect(pipeline[3]).toMatchObject({
			$match: { "specialty_details.name": { $in: SPECIALTIES } },
		});
	});

	it("should skip specialty filters for empty array", () => {
		pipeline = new IpsPipelineBuilder()
			.addGeoStage(TEST_COORDS[0], TEST_COORDS[1], MAX_DISTANCE)
			.matchesSpecialties([])
			.build();

		// No stages added by matchesSpecialties if empty array.
		expect(pipeline).toHaveLength(1);
	});

	it("should add EPS filters when provided", () => {
		pipeline = new IpsPipelineBuilder()
			.addGeoStage(TEST_COORDS[0], TEST_COORDS[1], MAX_DISTANCE)
			.matchesEps(EPS_NAMES)
			.build();

		// The pipeline should include the geo stage (1) plus 4 stages added by matchesEps
		expect(pipeline).toHaveLength(5);
		// Stage 1 should be the first $lookup from epsLookup.
		expect(pipeline[1]).toMatchObject({
			$lookup: {
				from: "EPS_IPS",
				localField: "_id",
				foreignField: "ips_id",
				as: "eps_ips",
			},
		});
		// Stage 3 should be the $match filtering on eps.name.
		expect(pipeline[3]).toMatchObject({
			$match: { "eps.name": { $in: EPS_NAMES } },
		});
	});

	it("should handle combined filters and pagination", () => {
		pipeline = new IpsPipelineBuilder()
			.addGeoStage(TEST_COORDS[0], TEST_COORDS[1], MAX_DISTANCE)
			.matchesSpecialties(SPECIALTIES)
			.matchesEps(EPS_NAMES)
			.addPagination(PAGE, PAGE_SIZE)
			.build();

		// Expected length: geo (1) + matchesSpecialties (4) + matchesEps (4) + pagination (1) = 10
		expect(pipeline).toHaveLength(10);
		const facetStage = pipeline.find((stage) => "$facet" in stage);
		expect(facetStage?.$facet?.data[0]).toMatchObject({
			$skip: (PAGE - 1) * PAGE_SIZE,
		});
		expect(facetStage?.$facet?.data[1]).toMatchObject({
			$limit: PAGE_SIZE,
		});
	});

	it("should maintain stage order", () => {
		pipeline = new IpsPipelineBuilder()
			.addGeoStage(TEST_COORDS[0], TEST_COORDS[1], MAX_DISTANCE)
			.matchesEps(EPS_NAMES)
			.matchesSpecialties(SPECIALTIES)
			.addPagination(PAGE, PAGE_SIZE)
			.build();

		// Expected stage order:
		// 0: $geoNear
		// 1: $lookup (epsLookup)
		// 2: $lookup (epsJoin)
		// 3: $match (eps filter)
		// 4: $project (baseProjection from eps filter)
		// 5: $lookup (specialtyLookup)
		// 6: $lookup (specialtyJoin)
		// 7: $match (specialty filter)
		// 8: $project (baseProjection from specialty filter)
		// 9: $facet (pagination)
		const stageTypes = pipeline.map((stage) => Object.keys(stage)[0]);
		expect(stageTypes).toEqual([
			"$geoNear",
			"$lookup",
			"$lookup",
			"$match",
			"$project",
			"$lookup",
			"$lookup",
			"$match",
			"$project",
			"$facet",
		]);
	});
});
