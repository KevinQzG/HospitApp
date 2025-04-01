import {
  LookupStage,
  AddFieldsStage,
  ProjectStage,
} from "./pipeline.interface";
import { PipelineBuilder } from "./pipeline.builder";

/**
 * Class that allows to build a pipelines for Mongo queries related to IPS.
 *
 * @class IpsPipelineBuilder
 */
export class IpsPipelineBuilder extends PipelineBuilder {
  constructor() {
    super();
  }

  /**
   * Adds an EPS join to the pipeline.
   *
   * @returns {PipelineBuilder} The builder instance.
   * @memberof IpsPipelineBuilder
   * @public
   * @method
   * @name with_eps
   */
  withEps(): this {
    this.getPipeline().push(
      { $lookup: this.epsLookup },
      { $lookup: this.epsJoin },
      { $project: { "eps_ips": 0 } }
    );

    return this;
  }

  /**
   * Adds a specialty join to the pipeline.
   *
   * @returns {PipelineBuilder} The builder instance.
   * @memberof IpsPipelineBuilder
   * @public
   * @method
   * @name with_specialties
   */
  withSpecialties(): this {
    this.getPipeline().push(
      { $lookup: this.specialtyLookup },
      { $lookup: this.specialtyJoin },
      { $addFields: this.specialtyAddFieldsNameSchedules },
      { $project: { specialtyDetails: 0 } }
    );

    return this;
  }

  /**
   * Adds a specialty filter to the pipeline.
   *
   * @param {string[]} specialties - The specialties to filter.
   * @returns {PipelineBuilder} The builder instance.
   * @memberof IpsPipelineBuilder
   * @public
   * @method
   * @name matches_specialties
   */
  matchesSpecialties(specialties: string[]): this {
    if (specialties.length === 0) return this;

    this.getPipeline().push(
      { $lookup: this.specialtyLookup },
      { $lookup: this.specialtyJoin },
      { $match: { "specialty_details.name": { $in: specialties } } },
      { $project: this.baseProjection }
    );

    return this;
  }

  /**
   * Adds an EPS filter to the pipeline.
   *
   * @param {string[]} epsNames - The EPS to filter.
   * @returns {PipelineBuilder} The builder instance.
   * @memberof IpsPipelineBuilder
   * @public
   * @method
   * @name matches_eps
   */
  matchesEps(epsNames: string[]): this {
    if (epsNames.length === 0) return this;

    this.getPipeline().push(
      { $lookup: this.epsLookup },
      { $lookup: this.epsJoin },
      { $match: { "eps.name": { $in: epsNames } } },
      { $project: this.baseProjection }
    );

    return this;
  }

  /**
   * Adds a final projection stage to the pipeline.
   *
   * @returns {PipelineBuilder} The builder instance.
   * @memberof IpsPipelineBuilder
   * @public
   * @method
   * @name add_final_projection
   */
  addFinalProjection(): this {
    this.getPipeline().push({
      $project: {
        name: 1,
        department: 1,
        town: 1,
        address: 1,
        phone: 1,
        email: 1,
        location: 1,
        level: 1,
        distance: 1,
        eps: {
          $sortArray: { input: "$eps", sortBy: { name: 1 } },
        },
        specialties: {
          $sortArray: { input: "$specialties", sortBy: { name: 1 } },
        },
  		reviews: {
          $sortArray: { input: "$reviews", sortBy: { rating: -1, userEmail: 1 } },
        }
      },
    });

    return this;
  }

  /**
   * Returns the lookup stage for reviews.
   * @returns {LookupStage} The lookup stage.
   */
  private get reviewsLookup(): LookupStage {
    return {
      from: "Review",
      localField: "_id",
      foreignField: "ips",
      as: "reviews",
    };
  }

  /**
   * Returns the lookup stage for users.
   * @returns {LookupStage} The lookup stage.
   */
  private get userLookup(): LookupStage {
    return {
      from: "USERS",
      localField: "reviews.user",
      foreignField: "_id",
      as: "user_details",
    };
  }

  /**
   * Returns the lookup stage for specialties.
   * @returns {LookupStage} The lookup stage.
   */
  private get specialtyLookup(): LookupStage {
    return {
      from: "IPS_Specialty",
      localField: "_id",
      foreignField: "ips_id",
      as: "specialties",
    };
  }

  /**
   * Returns the lookup stage for specialties.
   * @returns {LookupStage} The lookup stage.
   */
  private get specialtyJoin(): LookupStage {
    return {
      from: "Specialty",
      localField: "specialties.specialty_id",
      foreignField: "_id",
      as: "specialty_details",
    };
  }

  /**
   * Returns the lookup stage for EPS.
   * @returns {LookupStage} The lookup stage.
   */
  private get epsLookup(): LookupStage {
    return {
      from: "EPS_IPS",
      localField: "_id",
      foreignField: "ips_id",
      as: "eps_ips",
    };
  }

  /**
   * Returns the lookup stage for EPS.
   * @returns {LookupStage} The lookup stage.
   */
  private get epsJoin(): LookupStage {
    return {
      from: "EPS",
      localField: "eps_ips.eps_id",
      foreignField: "_id",
      as: "eps",
    };
  }

  /**
   * Returns the base projection for the pipeline.
   * @returns {ProjectStage} The projection stage.
   */
  private get baseProjection(): ProjectStage {
    return {
      name: 1,
      department: 1,
      town: 1,
      address: 1,
      phone: 1,
      email: 1,
      location: 1,
      level: 1,
      distance: 1,
    };
  }

  /**
   * Returns the add fields stage for specialties.
   * @returns {AddFieldsStage} The add fields stage.
   */
  private get specialtyAddFieldsNameSchedules(): AddFieldsStage {
    return {
      specialties: {
        $map: {
          input: "$specialties",
          as: "s",
          in: {
            _id: {
              $let: {
                vars: {
                  matched: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$specialty_details",
                          as: "sp",
                          cond: {
                            $eq: ["$$sp._id", "$$s.specialty_id"],
                          },
                        },
                      },
                      0,
                    ],
                  },
                },
                in: "$$matched._id",
              },
            },
            name: {
              $let: {
                vars: {
                  matched: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$specialty_details",
                          as: "sp",
                          cond: {
                            $eq: ["$$sp._id", "$$s.specialty_id"],
                          },
                        },
                      },
                      0,
                    ],
                  },
                },
                in: "$$matched.name",
              },
            },
            "schedule_monday": "$$s.schedule_monday",
            "schedule_tuesday": "$$s.schedule_tuesday",
            "schedule_wednesday": "$$s.schedule_wednesday",
            "schedule_thursday": "$$s.schedule_thursday",
            "schedule_friday": "$$s.schedule_friday",
            "schedule_saturday": "$$s.schedule_saturday",
            "schedule_sunday": "$$s.schedule_sunday",
          },
        },
      },
    };
  }
}
