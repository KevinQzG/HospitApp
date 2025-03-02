// src/adapters/_container.ts
import { Container } from 'inversify';
import { _TYPES } from './types';
import IpsRepositoryAdapter from './ips_repository.adapter';
import EpsRepositoryAdapter from './eps_repository.adapter';
import DBAdapter from './db.adapter';
import MongoDB from '@/config/mongo_db';
import { IpsMongoRepository } from '@/repositories/ips_mongo.repository';
import { EpsMongoRepository } from '@/repositories/eps_mongo.repository';



const _CONTAINER = new Container();

// Bind the database implementation as singleton
_CONTAINER.bind<DBAdapter>(_TYPES.DBAdapter).to(MongoDB).inSingletonScope();
_CONTAINER.bind<IpsRepositoryAdapter>(_TYPES.IpsRepositoryAdapter).to(IpsMongoRepository)
_CONTAINER.bind<EpsRepositoryAdapter>(_TYPES.EpsRepositoryAdapter).to(EpsMongoRepository)

export default _CONTAINER;