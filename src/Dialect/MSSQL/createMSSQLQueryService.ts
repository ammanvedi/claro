import * as TE from "fp-ts/TaskEither";
import * as R from "fp-ts/Reader";
import * as RR from "fp-ts/ReadonlyRecord";
import * as ROA from "fp-ts/ReadonlyArray"
import * as mssql from 'mssql'
import {pipe} from "fp-ts/function";
import {IResult as MSSQLResultWrapper} from "mssql";

type QueryError = Error

export interface IMSSQLQueryService {
    query<ResultType>(query: QueryDescription): TE.TaskEither<QueryError, MSSQLResultWrapper<ResultType>>
}

type IQueryServiceEnv = {
    connection: mssql.ConnectionPool
}


export type QueryVariable = {
    name: string,
    type: mssql.ISqlType,
    value: unknown
}

export type QueryDescription = {
    variables: readonly QueryVariable[],
    query: string
}

export const createMSSQLQueryService: R.Reader<IQueryServiceEnv, IMSSQLQueryService> = ({connection}) => {
    return {
        query: <ResultType>(query: QueryDescription): TE.TaskEither<QueryError, MSSQLResultWrapper<ResultType>> => pipe(
            TE.tryCatch(
                () =>
                    ROA.reduce<QueryVariable, mssql.Request>(
                        connection.request(),
                        (request, variable) => {
                            return request.input(variable.name, variable.type, variable.value)
                        }
                    )(query.variables).query(query.query),
                (e) => new Error(e.toString())
            )
        )
    }
}