// src/adapters/_container.ts
import { Container } from 'inversify';
import { _TYPES } from './types';
import DBInterface from '@/adapters/db_interface';
import MongoDB from '@/config/mongo_db';
import IpsRepositoryInterface from '@/adapters/ips_repository_interface';
import { IpsMongoRepository } from '@/repositories/ips_mongo_repository';


const _CONTAINER = new Container();

// Bind the database implementation as singleton
_CONTAINER.bind<DBInterface>(_TYPES.DBInterface).to(MongoDB).inSingletonScope();
_CONTAINER.bind<IpsRepositoryInterface>(_TYPES.IpsRepositoryInterface)
    .to(IpsMongoRepository)

export default _CONTAINER;