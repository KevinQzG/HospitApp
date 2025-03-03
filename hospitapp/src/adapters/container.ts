// src/adapters/_container.ts
import { Container } from 'inversify';
import { _TYPES } from './types';
import IpsRepositoryAdapter from './ips_repository.adapter';
import EpsRepositoryAdapter from './eps_repository.adapter';
import SpecialtyRepositoryAdapter from './specialty_repository.adapter';
import SearchIpsServiceAdapter from './search_ips.service.adapter';
import DBAdapter from './db.adapter';
import MongoDB from '@/config/mongo_db';
import { IpsMongoRepository } from '@/repositories/ips_mongo.repository';
import { EpsMongoRepository } from '@/repositories/eps_mongo.repository';
import { SpecialtyMongoRepository } from '@/repositories/specialty_mongo.repository';
import { SearchIpsMongoService } from '@/services/search_ips_mongo.service';



const _CONTAINER = new Container();

// Bind the database implementation as singleton
_CONTAINER.bind<DBAdapter>(_TYPES.DBAdapter).to(MongoDB).inSingletonScope();
_CONTAINER.bind<IpsRepositoryAdapter>(_TYPES.IpsRepositoryAdapter).to(IpsMongoRepository)
_CONTAINER.bind<EpsRepositoryAdapter>(_TYPES.EpsRepositoryAdapter).to(EpsMongoRepository)
_CONTAINER.bind<SpecialtyRepositoryAdapter>(_TYPES.SpecialtyRepositoryAdapter).to(SpecialtyMongoRepository)
_CONTAINER.bind<SearchIpsServiceAdapter>(_TYPES.SearchIpsServiceAdapter).to(SearchIpsMongoService)

export default _CONTAINER;