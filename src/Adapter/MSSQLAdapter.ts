import {Entity, EntityRelationShip, IAdapter} from "./IAdapter";
import * as mssql from 'mssql'

type MSSQLAdapterConfig = {
    connection: mssql.config
}

export class MSSQLAdapter implements IAdapter {
    connection: mssql.ConnectionPool

    constructor(private readonly config: MSSQLAdapterConfig) {
    }


    async connect() {
       this.connection = await mssql.connect(this.config.connection)
    }


    determineEntities(): Entity[] {
        return [];
    }

    determineRelationships(): EntityRelationShip[] {
        return [];
    }
}