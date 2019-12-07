import * as Faker from 'faker';
import { Connection, ObjectType } from 'typeorm';
import { EntityFactory } from './entity-factory';
export declare type FactoryFunction<Entity, Settings> = (faker: typeof Faker, settings?: Settings) => Entity;
export declare type EntityProperty<Entity> = {
    [Property in keyof Entity]?: Entity[Property];
};
export declare type Factory = <Entity, Settings>(entity: ObjectType<Entity>) => (settings?: Settings) => EntityFactory<Entity, Settings>;
export interface Seeder {
    run(factory: Factory, connection: Connection): Promise<void>;
}
export declare type SeederConstructor = new () => Seeder;
export interface EntityFactoryDefinition<Entity, Settings> {
    entity: ObjectType<Entity>;
    factory: FactoryFunction<Entity, Settings>;
}
