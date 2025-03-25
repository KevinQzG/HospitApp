import { PipelineStage } from '@/repositories/builders/ips.pipeline.interface';
import { IpsPipelineBuilder } from '@/repositories/builders/ips.pipeline.builder';

describe('IpsPipelineBuilder', () => {
    const TEST_COORDS = [-75.6381, 6.1334];
    const MAX_DISTANCE = 5000;
    const SPECIALTIES = ['CARDIOLOGY', 'NEUROLOGY'];
    const EPS_NAMES = ['EPS_1', 'EPS_2'];
    const PAGE = 2;
    const PAGE_SIZE = 10;

    let pipeline: PipelineStage[];

    it('should build basic geo query pipeline', () => {
        pipeline = new IpsPipelineBuilder()
            .addGeoStage(TEST_COORDS[0], TEST_COORDS[1], MAX_DISTANCE)
            .build();

        expect(pipeline).toHaveLength(1);
        expect(pipeline[0]).toMatchObject({
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: TEST_COORDS
                },
                maxDistance: MAX_DISTANCE
            }
        });
    });

    it('should add specialty filters when provided', () => {
        pipeline = new IpsPipelineBuilder()
            .addGeoStage(TEST_COORDS[0], TEST_COORDS[1], MAX_DISTANCE)
            .matchesSpecialties(SPECIALTIES)
            .build();

        expect(pipeline).toHaveLength(5);
        expect(pipeline[1]).toMatchObject({
            $lookup: {
                from: 'IPS_Specialty',
                localField: '_id',
                foreignField: 'ips_id',
                as: 'specialties'
            }
        });
        expect(pipeline[3]).toMatchObject({ $match: { 'specialty_details.name': { $in: SPECIALTIES } } });
    });

    it('should skip specialty filters for empty array', () => {
        pipeline = new IpsPipelineBuilder()
            .addGeoStage(TEST_COORDS[0], TEST_COORDS[1], MAX_DISTANCE)
            .matchesSpecialties([])
            .build();

        expect(pipeline).toHaveLength(1);
    });

    it('should add EPS filters when provided', () => {
        pipeline = new IpsPipelineBuilder()
            .addGeoStage(TEST_COORDS[0], TEST_COORDS[1], MAX_DISTANCE)
            .matchesEps(EPS_NAMES)
            .build();

        expect(pipeline).toHaveLength(5);
        expect(pipeline[1]).toMatchObject({
            $lookup: {
                from: 'EPS_IPS',
                localField: '_id',
                foreignField: 'ips_id',
                as: 'eps_ips'
            }
        });
        expect(pipeline[3]).toMatchObject({ $match: { 'eps.name': { $in: EPS_NAMES } } });
    });

    it('should handle combined filters and pagination', () => {
        pipeline = new IpsPipelineBuilder()
            .addGeoStage(TEST_COORDS[0], TEST_COORDS[1], MAX_DISTANCE)
            .matchesSpecialties(SPECIALTIES)
            .matchesEps(EPS_NAMES)
            .withPagination(PAGE, PAGE_SIZE)
            .build();

        expect(pipeline).toHaveLength(10);
        const FACET_STAGE = pipeline.find(s => '$facet' in s);
        expect(FACET_STAGE?.$facet?.data[0]).toMatchObject({ $skip: 10 });
        expect(FACET_STAGE?.$facet?.data[1]).toMatchObject({ $limit: 10 });
    });

    it('should maintain stage order', () => {
        pipeline = new IpsPipelineBuilder()
            .addGeoStage(TEST_COORDS[0], TEST_COORDS[1], MAX_DISTANCE)
            .matchesEps(EPS_NAMES)
            .matchesSpecialties(SPECIALTIES)
            .withPagination(PAGE, PAGE_SIZE)
            .build();

        const stageTypes = pipeline.map(s => Object.keys(s)[0]);
        expect(stageTypes).toEqual([
            '$geoNear',
            '$lookup',
            '$lookup',
            '$match',
            '$project',
            '$lookup',
            '$lookup',
            '$match',
            '$project',
            '$facet'
        ]);
    });
});