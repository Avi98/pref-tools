import { logging } from '../../utils/logging';
import { yargsCommandType } from '../../utils/yargs/types';
import PuppeteerManager from '../core/puppeteer/puppeteerManager';
import { collectOptions } from './options';
import { getCollectArgs, readFile } from './utils';

export const collectLHReport: yargsCommandType = {
  command: 'collect',
  description: 'collect the report',
  builder: (y) => y.option(collectOptions),
  module: {
    handler: async (argv: any) => {
      logging(`collect method ran with following args:`, 'success');
      let configFromFile;
      try {
        configFromFile = readFile(argv.rcPath);
      } catch (e: any) {
        logging(e.message, 'error');
        return;
      }

      const collectArgs = getCollectArgs(argv);
      const config = { ...configFromFile, ...collectArgs.collect };
      const puppeteerManger = new PuppeteerManager(config);

      /**
       * start a server and serve build dir on it.
       * launch puppeteer and all scripts(look for template)
       * run lighthouse cli
       */
    },
  },
};
