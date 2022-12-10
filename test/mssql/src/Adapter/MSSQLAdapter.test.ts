import {setupMSSqlDbState} from "../../setup";
import {IMigrator} from "../../../Migrator";

describe('MSSQLAdapter', function () {


    describe('Basic one to one relationship', () => {
        let down: IMigrator['down'];
        beforeEach(async () => {
            down = await setupMSSqlDbState("basic-one-to-one");

        })

        afterEach(async () => {
            await down();
        })

        it('should determine a one to one relationship', () => {

        })


    })
});