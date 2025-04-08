// src/adapters/_container.ts
import { Container } from "inversify";
import { TYPES } from "./types";
import IpsRepositoryAdapter from "./repositories/ips_repository.adapter";
import EpsRepositoryAdapter from "./repositories/eps_repository.adapter";
import SpecialtyRepositoryAdapter from "./repositories/specialty_repository.adapter";
import IpsServiceAdapter from "./services/ips.service.adapter";
import UserRepositoryAdapter from "./repositories/user_repository.adapter";
import ReviewRepositoryAdapter from "./repositories/review_repository.adapter";
import SpecialtyServiceAdapter from "./services/specialty.service.adapter";
import EpsServiceAdapter from "./services/eps.service.adapter";
import DBAdapter from "./db.adapter";
import MongoDB from "@/config/mongo_db";
import { IpsMongoRepository } from "@/repositories/ips_mongo.repository";
import { EpsMongoRepository } from "@/repositories/eps_mongo.repository";
import { SpecialtyMongoRepository } from "@/repositories/specialty_mongo.repository";
import { IpsMongoService } from "@/services/ips_mongo.service";
import { UserMongoRepository } from "@/repositories/user_mongo.repository";
import { ReviewMongoRepository } from "@/repositories/review_mongo.repository";
import { SpecialtyMongoService } from "@/services/specialty_mongo.service";
import { EpsMongoService } from "@/services/eps_mongo.service";
const CONTAINER = new Container();

// Bind the database implementation as singleton
CONTAINER.bind<DBAdapter>(TYPES.DBAdapter).to(MongoDB).inSingletonScope();
CONTAINER.bind<IpsRepositoryAdapter>(TYPES.IpsRepositoryAdapter).to(
	IpsMongoRepository
);
CONTAINER.bind<EpsRepositoryAdapter>(TYPES.EpsRepositoryAdapter).to(
	EpsMongoRepository
);
CONTAINER.bind<SpecialtyRepositoryAdapter>(TYPES.SpecialtyRepositoryAdapter).to(
	SpecialtyMongoRepository
);
CONTAINER.bind<IpsServiceAdapter>(TYPES.IpsServiceAdapter).to(IpsMongoService);
CONTAINER.bind<UserRepositoryAdapter>(TYPES.UserRepositoryAdapter).to(
	UserMongoRepository
);
CONTAINER.bind<ReviewRepositoryAdapter>(TYPES.ReviewRepositoryAdapter).to(
	ReviewMongoRepository
);
CONTAINER.bind<SpecialtyServiceAdapter>(TYPES.SpecialtyServiceAdapter).to(
	SpecialtyMongoService
);
CONTAINER.bind<EpsServiceAdapter>(TYPES.EpsServiceAdapter).to(EpsMongoService);

export default CONTAINER;
