import { defaultOutputFile } from '../../utils';
import { yargsCommandType } from '../../utils/yargs/types';
import { handler } from './handler';

const options = {
  outDir: {
    alias: ['outir', '-d'],
    description: 'Path to the saved dir',
    type: 'string',
    default: defaultOutputFile,
  },
  urls: {
    alias: ['urls', '-u'],
    description: 'List of the urls to run on lighthouse',
    type: 'string',
    default: defaultOutputFile,
    array: true,
  },
  sitesFilePath: {
    alias: ['sites', '-s'],
    description: 'File path that consists of all the urls',
    type: 'string',
  },
} as const;

export const batchRun: yargsCommandType = {
  command: 'batch_lh',
  description: 'batch run all the files ',
  builder: (y) => y.option(options),
  module: {
    //@TODO
    handler,
  },
};
