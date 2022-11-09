import {setupMSSqlDbState} from "../setup";
import {IMigrator} from "../../Migrator";

describe('test', function () {
    let down: IMigrator['down'];
    beforeEach(async () => {
        down = await setupMSSqlDbState("basic-one-to-one")
    })

    afterEach(async () => {
        await down();
    })

    it('abc', () => {
        expect(true).toBe(true)
    })
});