import {Entity, EntityRelationShip, IAdapter} from "../../Adapter/IAdapter";
import * as mssql from 'mssql'
import {IMSSQLQueryService} from "./createMSSQLQueryService";
import * as TE from 'fp-ts/TaskEither'
import {determineEntities, EntityError} from "./determineEntities";

export type AdapterDependencies = {
    queryService: IMSSQLQueryService
}

export const createMSSQLAdapter = (deps: AdapterDependencies): IAdapter => {

    return {
        determineRelationships(): TE.TaskEither<EntityError, EntityRelationShip[]> {
            return TE.fromNullable(new Error())(null)
        },
        connect(): TE.TaskEither<EntityError, void> {
            return TE.fromNullable(new Error())(null)
        },
        determineEntities(): TE.TaskEither<EntityError, Entity[]> {
            return determineEntities(deps)
        }
    }
}

