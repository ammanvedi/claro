
type EntityId = string;

export enum EntityFieldType {
    String = 'String',
    Number = 'Number',
    Date = 'Date'
}

export type EntityField =
    | {type: EntityFieldType.String, id: EntityId}
    | {type: EntityFieldType.Number, id: EntityId}
    | {type: EntityFieldType.Date, id: EntityId}

export enum EntityRelationType {
    OneToOne = 'OneToOne',
    OneToMany = 'OneToMany',
    ManyToOne = 'ManyToOne',
    ManyToMany = 'ManyToMany'
}

type EntityRelationOneToOne = {
    type: EntityRelationType.OneToOne,
    source: {
        id: EntityId,
        field: string
    },
    destination: {
        id: EntityId
    }
}

export type EntityRelationShip =
    | EntityRelationOneToOne

export type Entity = {
    id: EntityId,
    fields: EntityField[]
}




export interface IAdapter {
    connect(): Promise<void>
    determineRelationships(): EntityRelationShip[];
    determineEntities(): Entity[]
}