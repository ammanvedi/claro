import {isDbRunning, isDockerRunning} from "./setup";
import {logger} from "../utils";

beforeAll(async () => {
    logger.info('Checking docker is running...')
    const dockerRunning = await isDockerRunning()
    if(!dockerRunning) {
        logger.err('Docker not running, have you started colima? (colima start --arch amd)');
        throw new Error()
    }
    logger.succ('Docker is running');

    logger.info('Checking for database availability');
    const dbUp = await isDbRunning();
    if(!dbUp) {
        logger.err('Database not running, have you started the containers?');
        throw new Error()
    }
})