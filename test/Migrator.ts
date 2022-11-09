import * as sql from 'mssql'
import { join } from 'path'
import {readFileSync} from 'fs'

export interface IMigrator {
    up(): Promise<void>;
    down(): Promise<void>;
    connect(): Promise<void>;
    disconnect(): Promise<void>
}


interface MSSQLMigratorConfig {
    db: {
        user: string,
        password: string,
        server: string,
        port: number,
        database: string,
    },
    migrations: {
        path: string
    }
}

export class MSSQLMigrator implements IMigrator {

    private mssqlClient: sql.ConnectionPool

    constructor(private readonly config: MSSQLMigratorConfig) {}

    private readMigrationFile(direction: 'up' | 'down'): string {
        const path = join(this.config.migrations.path, `${direction}.sql`)
        return readFileSync(path).toString();
    }

    private async  getDBIndependentConnection(): Promise<sql.ConnectionPool> {
        const {database, ...restConfig} = this.config.db

        const tempConnection = await sql.connect({
            ...restConfig,
            options: {
                trustServerCertificate: true
            }
        })

        return tempConnection
    }

    private async setupDatabase() {
        /**
         * Make sure we have the database set up before we make the actual connection
         */
        const tempConnection = await this.getDBIndependentConnection()

        await tempConnection.query(`CREATE DATABASE ${this.config.db.database};`);

        await tempConnection.close()
    }

    private async teardownDatabase() {
        const tempConnection = await this.getDBIndependentConnection()
        await tempConnection.query(`DROP DATABASE IF EXISTS ${this.config.db.database};`);
        await tempConnection.close()
    }


    async connect() {
        await this.setupDatabase()

        this.mssqlClient = await sql.connect({
            ...this.config.db,
            options: {
                trustServerCertificate: true
            }
        })
    }

    async disconnect() {
        return this.mssqlClient.close()
    }


    async down() {
        await this.mssqlClient.query(this.readMigrationFile('down'))
        await this.disconnect()
        await this.teardownDatabase()
    }

    async up() {
        await this.mssqlClient.query(this.readMigrationFile('up'))
    }
}