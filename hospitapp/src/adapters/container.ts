// src/adapters/_container.ts
import { Container } from 'inversify';
import DBInterface from '@/adapters/db_interface';
import MongoDB from '@/config/mongo_db';
import { _TYPES } from './types';

const _CONTAINER = new Container();

// Bind the database implementation as singleton
_CONTAINER.bind<DBInterface>(_TYPES.DBInterface).to(MongoDB).inSingletonScope();

export default _CONTAINER;