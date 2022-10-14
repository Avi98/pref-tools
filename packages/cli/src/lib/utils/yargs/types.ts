import { Argv, CommandModule } from 'yargs';

export type yargsCommandType = {
  command: string | ReadonlyArray<string>;
  description: string;
  builder?: (y: Argv) => unknown;
  module: CommandModule;
};
