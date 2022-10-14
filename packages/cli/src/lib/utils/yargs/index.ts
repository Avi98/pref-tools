import * as yargs from 'yargs';
import { yargsCommandType } from './types';

type setupYargs = {
  commands: yargsCommandType[];
  options: Record<string, yargs.Options>;
  config: Record<string, any>;
};

export const setupYargs = ({ options, commands, config }: setupYargs) => {
  yargs
    .options(options)
    .parserConfiguration({
      'short-option-groups': true,
      'camel-case-expansion': true,
    })
    .recommendCommands()
    .config(config)
    .example([['collect -p', 'config file with path']])
    .help();

  commands.forEach((command) => {
    yargs.command(
      command.command,
      command.description,
      command?.builder ||
        (() => {
          ('');
        }),
      command.module.handler
    );
  });

  return yargs;
};
