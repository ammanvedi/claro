import * as RTE from 'fp-ts/ReaderTaskEither'
import * as O from 'fp-ts/Option'
import {AdapterDependencies} from "./createMSSQLAdapter";
import {Entity, EntityFieldType} from "../../Adapter/IAdapter";
import {pipe} from "fp-ts/function";
import * as A from 'fp-ts/Array'
import {QueryDescription, QueryVariable} from "./createMSSQLQueryService";
import * as mssql from 'mssql';

export type EntityError = Error

type TablesQueryShape = {
    table_name: string
}

enum MSSQLStoredDataTypes {
    Int = 'int',
    VarChar = 'varchar'
}

type ColumnsQueryShape = {
    TABLE_NAME: string,
    COLUMN_NAME: string,
    DATA_TYPE: MSSQLStoredDataTypes,
}

const MSSQLStoredDataTypeMap: Record<MSSQLStoredDataTypes, EntityFieldType> = {
    [MSSQLStoredDataTypes.Int]: EntityFieldType.Number,
    [MSSQLStoredDataTypes.VarChar]: EntityFieldType.String,
}

const getTableNames: RTE.ReaderTaskEither<AdapterDependencies, EntityError, string[]> =
    pipe(
        RTE.ask<AdapterDependencies>(),
        RTE.chainTaskEitherK(deps =>
            deps.queryService.query<TablesQueryShape>({
                    query: 'SELECT table_name FROM information_schema.tables;',
                    variables: []
                }
            )
        ),
        RTE.map(res => A.map<TablesQueryShape, string>(
            r => r.table_name
        )(res.recordset))
    )

const getTableVariableName = (tableName: string) => `table_${tableName}`

const getFieldsQueryVariables = (tableName: string): QueryVariable => pipe(
    tableName,
    tableName => ({
        type: mssql.VarChar(),
        value: tableName,
        name: getTableVariableName(tableName)
    })
)

const getFieldsQueryString = (tableName: string): string => pipe(
    tableName,
    name => `TABLE_NAME = @${getTableVariableName(name)}`,
    nameQuery => `select * from INFORMATION_SCHEMA.COLUMNS where ${nameQuery}`
)

const getFieldsQuery = (tableName: string): QueryDescription => pipe(
    tableName,
    names => ({
        variables: [getFieldsQueryVariables(names)],
        query: getFieldsQueryString(names)
    })
)

const buildEntityField = (column: ColumnsQueryShape): O.Option<Entity['fields'][0]> => {
    const type = MSSQLStoredDataTypeMap[column.DATA_TYPE];

    if(type) {
        return O.some({
            type,
            id: column.COLUMN_NAME
        })
    }

    return O.none
}

const buildEntity = (tableName: string, columns: ColumnsQueryShape[]): O.Option<Entity> => pipe(
    columns,
    A.map(buildEntityField),
    O.sequenceArray,
    O.map(fields => ({
        fields,
        id: tableName
    }))
)

const getEntityModelForTable = (tableName: string): RTE.ReaderTaskEither<AdapterDependencies, EntityError, Entity> => pipe(
    RTE.ask<AdapterDependencies>(),
    RTE.chainTaskEitherK(deps => deps.queryService.query<ColumnsQueryShape>(
        getFieldsQuery(tableName)
    )),
    RTE.map(res => buildEntity(tableName, res.recordset)),
    RTE.chain(
        O.fold(
            () => RTE.left(new Error('TODO better error')),
            entity => RTE.right(entity)
        )
    )
)

const getEntitiesFromTableNames = (tableNames: string[]): RTE.ReaderTaskEither<AdapterDependencies, EntityError, readonly Entity[]> => pipe(
    tableNames,
    A.map(getEntityModelForTable),
    RTE.sequenceArray,
)

export const determineEntities: RTE.ReaderTaskEither<AdapterDependencies, EntityError, readonly Entity[]> = pipe(
    RTE.ask<AdapterDependencies>(),
    RTE.chainTaskEitherKW(getTableNames),
    RTE.chain(tables => getEntitiesFromTableNames(tables))
)