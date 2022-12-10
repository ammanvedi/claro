import * as RTE from 'fp-ts/ReaderTaskEither'
import * as TE from 'fp-ts/TaskEither'
import * as mssql from 'mssql'
import {pipe} from "fp-ts/function";

type ConnectionEnv = {
    config: mssql.config
}

type ConnectionError = Error

export const createMSSQLConnection: RTE.ReaderTaskEither<
    ConnectionEnv,
    ConnectionError,
    mssql.ConnectionPool
> = pipe(
    RTE.ask<ConnectionEnv>(),
    RTE.chain(env => pipe(
        TE.tryCatch(
            () => mssql.connect(env.config),
            () => new Error('connection erorro')
        ),
        RTE.fromTaskEither
    ))
)