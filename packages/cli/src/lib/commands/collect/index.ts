import { logging } from '../../utils/logging';
import { yargsCommandType } from '../../utils/yargs/types';
import PuppeteerManager from '../core/puppeteer/puppeteerManager';
import { Server } from '../core/StartServer/runner';
import { collectOptions } from './options';
import { CollectOptionsType } from './options/types/collectOptionType';
import { getCollectArgs, readFile } from './utils';

export const collectLHReport: yargsCommandType = {
  command: 'collect',
  description: 'collect the report',
  builder: (y) => y.option(collectOptions),
  module: {
    handler: async (argv: any) => {
      logging(`collect method ran with following args:`, 'success');
      let configFromFile: CollectOptionsType;
      try {
        configFromFile = readFile(argv.rcPath);
      } catch (e: any) {
        logging(e.message, 'error');
        return;
      }

      const collectArgs = getCollectArgs(argv);
      const config = { ...configFromFile, ...collectArgs.collect };
      const pm = new PuppeteerManager(config);

      const { url: urls = [], puppeteerScript, template } = configFromFile;
      await pm.launchBrowser();
      const serve = new Server(config).start();

      try {
        for (const url of urls) {
          if (template) {
            pm.runPuppeteerScript(url);
          } else if (puppeteerScript) {
            pm.runPuppeteerScript(url);
          }
          //run lighthouse
        }

        //load the flow
        const uf = pm.loadUserFlow();
        pm.collectUFReport(uf);
      } catch (error) {
        throw new Error('');
      } finally {
        console.log('');
        (await serve).close();
        await pm.closeBrowser();
      }
    },
  },
};
