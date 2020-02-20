import { Connection, ConnectionOptions as TypeORMConnectionOptions } from 'typeorm';
interface SeedingOptions {
    readonly factories: string[];
    readonly seeds: string[];
}
export declare type ConnectionOptions = TypeORMConnectionOptions & SeedingOptions;
export declare const getConnectionOptions: (configPath?: string) => Promise<ConnectionOptions>;
export declare const createConnection: (configPath: string) => Promise<Connection>;
export {};
