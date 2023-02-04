import { ArgumentsCamelCase } from 'yargs';
import { LighthouseRunner } from '../../core/lighthouseRunner';
import { BatchRun } from '../../core/types';
import { cleanLHR, defaultOutputFile } from '../../utils';
import { logging } from '../../utils/logging';
import { yargsCommandType } from '../../utils/yargs/types';
import { getUrlsFromFiles } from './utils/getUrls';

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
    handler: async (argv: any) => {
      cleanLHR(argv['outDir']);
      if (argv.sitesFilePath && argv.urls) {
        throw new Error('Sites file and urls both can should not be provided');
      }

      const urlsFromFiles = getUrlsFromFiles(argv.sitesFilePath);

      const config: BatchRun = {
        lhOptions: {},
        outDir: argv.outDir,
        urls: argv.urls || urlsFromFiles,
        type: 'Batch',
      };

      const lh = new LighthouseRunner();
      const res = await lh.run('batchRun', config);
      console.log(res);
    },
  },
};
