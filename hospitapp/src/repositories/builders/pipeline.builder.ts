import {
	PipelineStage,
	ProjectStage,
	MatchStage,
	SortStage,
	AddFieldsStage,
} from "./pipeline.interface";

/**
 * Class that allows to build a pipeline for Mongo queries.
 *
 * @class PipelineBuilder
 */
export class PipelineBuilder {
	private pipeline: PipelineStage[];

	constructor() {
		this.pipeline = [];
	}

	/**
	 * Adds a geo stage to the pipeline.
	 *
	 * @param {number} longitude - Longitude of the user.
	 * @param {number} latitude - Latitude of the user.
	 * @param {number} maxDistance - Maximum distance to search.
	 * @returns {PipelineBuilder} The builder instance.
	 * @memberof IpsPipelineBuilder
	 * @public
	 * @method
	 * @name add_geo_stage
	 */
	addGeoStage(
		longitude: number | null,
		latitude: number | null,
		maxDistance: number | null
	): this {
		if (longitude === null || latitude === null || maxDistance === null)
			return this;

		this.pipeline.push({
			$geoNear: {
				near: {
					type: "Point",
					coordinates: [longitude, latitude],
				},
				distanceField: "distance",
				maxDistance: maxDistance,
				spherical: true,
			},
		});

		return this;
	}

	/**
	 * Adds a sort stage to the pipeline.
	 *
	 * @param {SortStage} sort - The sort object.
	 * @returns {PipelineBuilder} The builder instance.
	 * @memberof IpsPipelineBuilder
	 * @public
	 * @method
	 * @name addSortStage
	 */
	addSortStage(sort: SortStage): this {
		this.pipeline.push({ $sort: sort });

		return this;
	}

	/**
	 * Adds a match stage to the pipeline.
	 *
	 * @param {MatchStage} match - The match object.
	 * @returns {PipelineBuilder} The builder instance.
	 * @memberof IpsPipelineBuilder
	 * @public
	 * @method
	 * @name addMatchStage
	 */
	addMatchStage(match: MatchStage): this {
		this.pipeline.push({ $match: match });

		return this;
	}

	/**
	 * Adds a project stage to the pipeline.
	 *
	 * @param {ProjectStage} project - The project object.
	 * @returns {PipelineBuilder} The builder instance.
	 * @memberof IpsPipelineBuilder
	 * @public
	 * @method
	 * @name addProject
	 */
	addProjectStage(project: ProjectStage): this {
		this.pipeline.push({ $project: project });

		return this;
	}

	/**
	 * Adds a pagination stage to the pipeline.
	 *
	 * @param {number} page - The page number.
	 * @param {number} pageSize - The page size.
	 * @returns {PipelineBuilder} The builder instance.
	 * @memberof IpsPipelineBuilder
	 * @public
	 * @method
	 * @name with_pagination
	 */
	addPagination(page: number, pageSize: number): this {
		this.pipeline.push({
			$facet: {
				metadata: [{ $count: "total" }],
				data: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
			},
		});

		return this;
	}

	/**
	 * Adds a lookup stage to the pipeline.
	 *
	 * @returns {PipelineBuilder} The builder instance.
	 * @memberof IpsPipelineBuilder
	 * @public
	 * @method
	 * @name addLookupStage
	 */
	addLookupStage(
		from: string,
		localField: string,
		foreignField: string,
		as: string
	): this {
		this.pipeline.push({
			$lookup: {
				from,
				localField,
				foreignField,
				as,
			},
		});

		return this;
	}

	/**
	 * Adds a AddFields stage to the pipeline.
	 *
	 * @param {AddFieldsStage} addField - The addField object.
	 * @returns {PipelineBuilder} The builder instance.
	 * @memberof IpsPipelineBuilder
	 * @public
	 * @method
	 * @name addFieldsStage
	 */
	addFieldsStage(addField: AddFieldsStage): this {
		this.pipeline.push({ $addFields: addField });

		return this;
	}

	/**
	 * Returns the pipeline stages.
	 * @returns {PipelineStage[]} The pipeline stages.
	 */
	build(): PipelineStage[] {
		return [...this.pipeline];
	}

	/**
	 * Gets the pipeline stages.
	 * @returns {PipelineStage[]} The pipeline stages.
	 */
	getPipeline(): PipelineStage[] {
		return this.pipeline;
	}

	/**
	 * Sets the pipeline stages.
	 * @param {PipelineStage[]} pipeline - The pipeline stages.
	 */
	setPipeline(pipeline: PipelineStage[]) {
		this.pipeline = pipeline;
	}
}
