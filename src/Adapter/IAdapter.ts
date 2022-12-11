import * as TE from "fp-ts/TaskEither";
import {EntityError} from "../Dialect/MSSQL/determineEntities";

type EntityId = string;

export enum EntityFieldType {
    String = 'String',
    Number = 'Number',
    Date = 'Date'
}

export type EntityField =
    | {type: EntityFieldType.String, id: EntityId}
    | {type: EntityFieldType.Number, id: EntityId}
    | {type: EntityFieldType.Date, id: EntityId}

export enum EntityRelationType {
    OneToOne = 'OneToOne',
    OneToMany = 'OneToMany',
    ManyToOne = 'ManyToOne',
    ManyToMany = 'ManyToMany'
}

type EntityRelationOneToOne = {
    type: EntityRelationType.OneToOne,
    source: {
        id: EntityId,
        field: string
    },
    destination: {
        id: EntityId,
        field: string
    }
}

export type EntityRelationShip =
    | EntityRelationOneToOne

export type Entity = {
    id: Readonly<EntityId>,
    fields: readonly EntityField[]
}

export interface IAdapter {
    connect(): TE.TaskEither<EntityError, void>
    determineRelationships(): TE.TaskEither<EntityError, EntityRelationShip[]>;
    determineEntities(): TE.TaskEither<EntityError, readonly Entity[]>
}