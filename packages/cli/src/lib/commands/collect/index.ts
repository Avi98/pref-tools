import { logging } from '../../utils/logging';
import { yargsCommandType } from '../../utils/yargs/types';
import PuppeteerManager from '../core/puppeteer/puppeteerManager';
import { Server } from '../core/StartServer/runner';
import { collectOptions } from './options';
import { CollectOptionsType } from './options/types/collectOptionType';
import { getBaseUrl, getCollectArgs, readFile } from './utils';

export const collectLHReport: yargsCommandType = {
  command: 'collect',
  description: 'collect the report',
  builder: (y) => y.option(collectOptions),
  module: {
    handler: async (argv: any) => {
      logging(`collect method ran with following args:`, 'success');
      let configFromFile: { collect: CollectOptionsType };
      try {
        configFromFile = readFile(argv.rcPath);
      } catch (e: any) {
        console.error(e);
        throw e;
      }
      logging(`found file and read config file`, 'success');

      const collectArgs = getCollectArgs(argv);
      const config = { ...configFromFile.collect, ...collectArgs.collect };
      Object.assign(config, {
        chromeOptions: {
          ...config.chromeOptions,
          chromePath: PuppeteerManager.getDefaultChromePath(config),
        },
      });

      const pm = new PuppeteerManager(config);
      await pm.launchBrowser();
      const serve = await new Server(config).start();

      try {
        const { url: urls = [], puppeteerScript = '', template = {} } = config;
        if (template && serve.url) await pm.runTemplate(getBaseUrl(serve.url));

        for (const url of urls) {
          if (puppeteerScript) {
            await pm.runPuppeteerScript(url);
          }
          /**
           * Run lighthouse with median run 3 as default
           *
           * const report = new LighthouseRunner();
           * const medianRun = report.run('medianRun', {})
           *
           * save report on disk
           *
           */
        }

        //load the flow
        const uf = pm.loadUserFlow();
        pm.collectUFReport(uf);
      } catch (error) {
        console.log(error);
      } finally {
        await serve.close();
        await pm.closeBrowser();
      }
    },
  },
};
