import { cleanLHR, defaultOutputFile } from '../../utils';
import { logging } from '../../utils/logging';
import { yargsCommandType } from '../../utils/yargs/types';

const options = {
  baseDir: {
    alias: ['dir', '-d'],
    description: 'Path to the saved dir',
    type: 'string',
    default: defaultOutputFile,
  },
} as const;

export const cleanUp: yargsCommandType = {
  command: 'clean_up',
  description: 'clean all the generated files',
  builder: (y) => y.option(options),
  module: {
    handler: async (argv: any) => {
      logging('Cleaning up the reports');
      cleanLHR(argv.baseDir);
    },
  },
};
