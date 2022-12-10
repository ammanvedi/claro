import {setupMSSqlDbState} from "../../setup";
import {IMigrator} from "../../../Migrator";
import {createMSSQLAdapter} from "../../../../src/Dialect/MSSQL/createMSSQLAdapter";
import {EntityRelationType, IAdapter} from "../../../../src/Adapter/IAdapter";

import {pipe} from "fp-ts/function";
import {createMSSQLQueryService} from "../../../../src/Dialect/MSSQL/createMSSQLQueryService";
import {createMSSQLConnection} from "../../../../src/Dialect/MSSQL/createMSSQLConnection";
import {config} from "../../config";

import * as TE from 'fp-ts/TaskEither'

describe('MSSQLAdapter', function () {

    describe('Basic one to one relationship', () => {
        let down: IMigrator['down'];
        let adapter: IAdapter
        beforeEach(async () => {

            down = await setupMSSqlDbState("basic-one-to-one");

            const _adapter = await pipe(
                createMSSQLConnection({config}),
                TE.map(connection => {
                    return createMSSQLAdapter({
                        queryService: createMSSQLQueryService({ connection })
                    })
                })
            )();

            if(_adapter._tag === 'Left') {
                expect(true).toBe(false)
                return;
            }

            adapter = _adapter.right
        })

        afterEach(async () => {
            await down();
        })

        it('should determine entities', async () => {

            const determineEntities = await adapter.determineEntities()();

            console.log(determineEntities)
        })

        // it('should determine a one to one relationship', async () => {
        //     const relationships = await adapter.determineRelationships();
        //     expect(relationships).toMatchObject([
        //         {
        //             type: EntityRelationType.OneToOne,
        //             source: {
        //                 id: 'Salary',
        //                 field: 'EmployeeID'
        //             },
        //             destination: {
        //                 id: 'Employee',
        //                 field: 'ID'
        //             }
        //         }
        //     ])
        // })


    })
});