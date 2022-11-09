import * as sql from 'mssql'
import {logger, runCmd} from "../utils";
import {join} from 'path'
import {IMigrator, MSSQLMigrator} from "../Migrator";


type DBStateName =
    | 'basic-one-to-one'

const config: sql.config = {
    user: 'sa',
    password: 'MyPassword1!',
    server: 'localhost',
    port: 1433,
    options: {
        trustServerCertificate: true
    }
}

const testDBName = 'testdb'

export const isDockerRunning = async (): Promise<boolean> => {
    try {
        const {stdout, stderr} = await runCmd('colima status')
        return (stdout + stderr).includes('colima is running')
    } catch (e) {
        return false
    }
}

export const isDbRunning = async (): Promise<boolean> => {
    try {
        await sql.connect(config)
        return true
    } catch (e) {
        return false
    }
}

export const setupMSSqlDbState = async (
    state: DBStateName
) => {

    const migrator: IMigrator = new MSSQLMigrator({
        db: {
            user: config.user,
            password: config.password,
            server: config.server,
            port: config.port,
            database: testDBName
        },
        migrations: {
            path: join(__dirname, 'migrations', state)
        }
    });

    await migrator.connect();
    await migrator.up();

    return migrator.down.bind(migrator)
}