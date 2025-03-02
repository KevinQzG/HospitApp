import { PipelineStage } from '@/repositories/builders/ips.pipeline.interface';
import { IpsPipelineBuilder } from '@/repositories/builders/ips.pipeline.builder';

describe('IpsPipelineBuilder', () => {
    const _TEST_COORDS = [-75.6381, 6.1334];
    const _MAX_DISTANCE = 5000;
    const _SPECIALTIES = ['CARDIOLOGY', 'NEUROLOGY'];
    const _EPS_NAMES = ['EPS_1', 'EPS_2'];
    const _PAGE = 2;
    const _PAGE_SIZE = 10;

    let pipeline: PipelineStage[];

    it('should build basic geo query pipeline', () => {
        pipeline = new IpsPipelineBuilder()
            .add_geo_stage(_TEST_COORDS[0], _TEST_COORDS[1], _MAX_DISTANCE)
            .build();

        expect(pipeline).toHaveLength(1);
        expect(pipeline[0]).toMatchObject({
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: _TEST_COORDS
                },
                maxDistance: _MAX_DISTANCE
            }
        });
    });

    it('should add specialty filters when provided', () => {
        pipeline = new IpsPipelineBuilder()
            .add_geo_stage(_TEST_COORDS[0], _TEST_COORDS[1], _MAX_DISTANCE)
            .matches_specialties(_SPECIALTIES)
            .build();

        expect(pipeline).toHaveLength(5);
        expect(pipeline[1]).toMatchObject({
            $lookup: {
                from: 'IPS_Specialty',
                localField: '_id',
                foreignField: 'ips_id',
                as: 'ips_specialties'
            }
        });
        expect(pipeline[3]).toMatchObject({ $match: { 'specialty_details.name': { $in: _SPECIALTIES } } });
    });

    it('should skip specialty filters for empty array', () => {
        pipeline = new IpsPipelineBuilder()
            .add_geo_stage(_TEST_COORDS[0], _TEST_COORDS[1], _MAX_DISTANCE)
            .matches_specialties([])
            .build();

        expect(pipeline).toHaveLength(1);
    });

    it('should add EPS filters when provided', () => {
        pipeline = new IpsPipelineBuilder()
            .add_geo_stage(_TEST_COORDS[0], _TEST_COORDS[1], _MAX_DISTANCE)
            .matches_eps(_EPS_NAMES)
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
        expect(pipeline[3]).toMatchObject({ $match: { 'eps.name': { $in: _EPS_NAMES } } });
    });

    it('should handle combined filters and pagination', () => {
        pipeline = new IpsPipelineBuilder()
            .add_geo_stage(_TEST_COORDS[0], _TEST_COORDS[1], _MAX_DISTANCE)
            .matches_specialties(_SPECIALTIES)
            .matches_eps(_EPS_NAMES)
            .with_pagination(_PAGE, _PAGE_SIZE)
            .build();

        expect(pipeline).toHaveLength(10);
        const _FACET_STAGE = pipeline.find(s => '$facet' in s);
        expect(_FACET_STAGE?.$facet?.data[0]).toMatchObject({ $skip: 10 });
        expect(_FACET_STAGE?.$facet?.data[1]).toMatchObject({ $limit: 10 });
    });

    it('should maintain stage order', () => {
        pipeline = new IpsPipelineBuilder()
            .add_geo_stage(_TEST_COORDS[0], _TEST_COORDS[1], _MAX_DISTANCE)
            .matches_eps(_EPS_NAMES)
            .matches_specialties(_SPECIALTIES)
            .with_pagination(_PAGE, _PAGE_SIZE)
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