import * as R from "fp-ts/Reader";
import * as TE from 'fp-ts/TaskEither'
import * as RTE from 'fp-ts/ReaderTaskEither'
import * as ROA from 'fp-ts/ReadonlyNonEmptyArray'
import {AdapterDependencies} from "./createMSSQLAdapter";
import {Entity} from "../../Adapter/IAdapter";
import {pipe} from "fp-ts/function";
import * as A from 'fp-ts/Array'

export type EntityError = Error

type TablesQueryShape = {
    table_name: string
}

export const determineEntities: RTE.ReaderTaskEither<AdapterDependencies, EntityError, Entity[]> = pipe(
    R.ask<AdapterDependencies>(),
    R.map(deps =>
        deps.queryService.query<TablesQueryShape>({
                query: 'SELECT table_name FROM information_schema.tables;', variables: []
            }
        )
    ),
    RTE.map(res => A.map<TablesQueryShape, Entity>(
        r => ({id: r.table_name, fields: []})
    )(res.recordset))

)