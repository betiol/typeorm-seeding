import { ObjectType } from 'typeorm';
import { FactoryFunction, EntityProperty } from './types';
export declare class EntityFactory<Entity, Settings> {
    name: string;
    entity: ObjectType<Entity>;
    private factory;
    private settings?;
    private mapFunction;
    constructor(name: string, entity: ObjectType<Entity>, factory: FactoryFunction<Entity, Settings>, settings?: Settings);
    map(mapFunction: (entity: Entity) => Promise<Entity>): EntityFactory<Entity, Settings>;
    make(overrideParams?: EntityProperty<Entity>): Promise<Entity>;
    seed(overrideParams?: EntityProperty<Entity>): Promise<Entity>;
    makeMany(amount: number, overrideParams?: EntityProperty<Entity>): Promise<Entity[]>;
    seedMany(amount: number, overrideParams?: EntityProperty<Entity>): Promise<Entity[]>;
    private resolveEntity;
}
