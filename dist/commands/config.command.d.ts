import * as yargs from 'yargs';
export declare class ConfigCommand implements yargs.CommandModule {
    command: string;
    describe: string;
    builder(args: yargs.Argv): yargs.Argv<{
        c: string;
    }>;
    handler(args: yargs.Arguments): Promise<void>;
}
