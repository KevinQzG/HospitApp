// src/adapters/_container.ts
import { Container } from 'inversify';
import { _TYPES } from './types';
import DBAdapter from '@/adapters/db.adapter';
import MongoDB from '@/config/mongo_db';
import IpsRepositoryAdapter from '@/adapters/ips_repository.adapter';
import { IpsMongoRepository } from '@/repositories/ips_mongo.repository';


const _CONTAINER = new Container();

// Bind the database implementation as singleton
_CONTAINER.bind<DBAdapter>(_TYPES.DBAdapter).to(MongoDB).inSingletonScope();
_CONTAINER.bind<IpsRepositoryAdapter>(_TYPES.IpsRepositoryAdapter)
    .to(IpsMongoRepository)

export default _CONTAINER;