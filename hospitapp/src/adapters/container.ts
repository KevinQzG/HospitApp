// src/adapters/_container.ts
import { Container } from 'inversify';
import { TYPES } from './types';
import IpsRepositoryAdapter from './ips_repository.adapter';
import EpsRepositoryAdapter from './eps_repository.adapter';
import SpecialtyRepositoryAdapter from './specialty_repository.adapter';
import SearchIpsServiceAdapter from './search_ips.service.adapter';
import UserRepositoryAdapter from "./user_repository.adapter";
import ReviewRepositoryAdapter from './review_repository.adapter';
import DBAdapter from './db.adapter';
import MongoDB from '@/config/mongo_db';
import { IpsMongoRepository } from '@/repositories/ips_mongo.repository';
import { EpsMongoRepository } from '@/repositories/eps_mongo.repository';
import { SpecialtyMongoRepository } from '@/repositories/specialty_mongo.repository';
import { SearchIpsMongoService } from '@/services/search_ips/search_ips_mongo.service';
import { UserMongoRepository } from '@/repositories/user_mongo.repository';
import { ReviewMongoRepository } from '@/repositories/review_mongo.repository';


const CONTAINER = new Container();

// Bind the database implementation as singleton
CONTAINER.bind<DBAdapter>(TYPES.DBAdapter).to(MongoDB).inSingletonScope();
CONTAINER.bind<IpsRepositoryAdapter>(TYPES.IpsRepositoryAdapter).to(IpsMongoRepository)
CONTAINER.bind<EpsRepositoryAdapter>(TYPES.EpsRepositoryAdapter).to(EpsMongoRepository)
CONTAINER.bind<SpecialtyRepositoryAdapter>(TYPES.SpecialtyRepositoryAdapter).to(SpecialtyMongoRepository)
CONTAINER.bind<SearchIpsServiceAdapter>(TYPES.SearchIpsServiceAdapter).to(SearchIpsMongoService)
CONTAINER.bind<UserRepositoryAdapter>(TYPES.UserRepositoryAdapter).to(UserMongoRepository);
CONTAINER.bind<ReviewRepositoryAdapter>(TYPES.ReviewRepositoryAdapter).to(ReviewMongoRepository);

export default CONTAINER;