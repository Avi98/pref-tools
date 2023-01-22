import { LighthouseRunner } from '../../core/lighthouseRunner';
import LH_UserFlow from '../../core/UserFlow';
import { cleanLHR, SaveLHR } from '../../utils';
import { OUTPUT_DIR } from '../../utils/constants';
import { logging } from '../../utils/logging';
import { yargsCommandType } from '../../utils/yargs/types';
import PuppeteerManager from '../core/puppeteer/puppeteerManager';
import { Server } from '../core/StartServer/runner';
import { collectOptions } from './options';
import { CollectOptionsType } from './options/types/collectOptionType';
import {
  getAppendedOrigins,
  getBaseUrl,
  getCollectArgs,
  readFile,
} from './utils';

const normalizeCollectConfig = (argv: any) => {
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
  return config;
};

export const collectLHReport: yargsCommandType = {
  command: 'collect_lh',
  description: 'collect the report',
  builder: (y) => y.option(collectOptions),
  module: {
    handler: async (argv) => {
      const config = normalizeCollectConfig(argv);

      //cleanup
      cleanLHR(config.outDir);

      logging(`collect method ran with following args:`, 'success');

      const pm = new PuppeteerManager(config);
      await pm.launchBrowser();
      const serve = await new Server(config).start();

      try {
        const { url: urls = [], puppeteerScript = '', template = {} } = config;
        if (template && serve.url) await pm.runTemplate(getBaseUrl(serve.url));
        const lh_run = new LighthouseRunner();

        if (!serve.url) throw new Error('serve.url is null');
        const urlsWithOrigin = getAppendedOrigins(serve.url, urls);

        for (const url of urlsWithOrigin) {
          if (puppeteerScript) {
            await pm.runPuppeteerScript(url);
          }
          const result = await lh_run.run('numberOfRun', {
            numberOfRuns: 1,
            urls: url,
            outDir: OUTPUT_DIR,
            lhOptions: config.chromeOptions || {},
            type: 'numberOfRun',
          });
          SaveLHR(JSON.stringify(result));
        }
      } catch (error) {
        console.log(error);
      } finally {
        await serve.close();
        await pm.closeBrowser();
      }
    },
  },
};

export const collectUFReport: yargsCommandType = {
  command: 'collect_uf',
  description: 'collect user flow report',
  builder: (y) => y.option(collectOptions),
  module: {
    handler: async (argv: any) => {
      logging('running user-flow', 'success');
      const config = normalizeCollectConfig(argv);

      if (argv?.userFlow) {
        if (argv.userFlow.userFlowPath) {
          const puppeteer = new PuppeteerManager(config);
          const lhUF = LH_UserFlow.create(config, puppeteer);

          const userFlows = await lhUF.loadUserFlows();
          for (const uf of userFlows) {
            await lhUF
              .collectFlows(uf)
              .then((flow) => lhUF.generateReport(flow))
              .then(SaveLHR)
              .catch((e) => {
                throw new Error(e);
              });
          }
        } else {
          logging('Please provide withe the user flows dir path', 'error');
        }
      }
    },
  },
};
