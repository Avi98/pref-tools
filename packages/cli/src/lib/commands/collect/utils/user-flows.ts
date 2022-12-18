import path from 'path';
import { existsSync, lstatSync, readdirSync } from 'fs';
import { lhFlow } from '../../../core/utils';
import { RcType } from '../../../types/rcJson';
import { UserFlow } from '../../core/lighthouse';
import PuppeteerManager from '../../core/puppeteer/puppeteerManager';

export const collectUserFlowReports = async (config: RcType['collect']) => {
  if (!config?.userFlow?.userFlowPath) {
    throw new Error('User flow path is not provided');
  }
  const userFlowDir = path.join(process.cwd(), config.userFlow.userFlowPath);

  const flows = loadUserFlows(userFlowDir);

  for (const flow of flows) {
    //@TODO: normalize config by userFlow options
    collectFlow(flow?.export, config);
  }
  return flows;
};

const collectFlow = async (
  { interaction }: UserFlow,
  config: RcType['collect']
) => {
  const puppeteer = new PuppeteerManager(config);
  const browser = await puppeteer.launchBrowser();
  const page = await browser.newPage();
  const { startFlow } = lhFlow();
  const flow = startFlow(page, config);

  await interaction({ page, flow, options: config });

  return flow;
};

const loadUserFlows = (dirPath: string): UserFlow => {
  if (!existsSync(dirPath)) {
    throw new Error('User flow directory does not exist');
  }

  let files = [];
  if (lstatSync(dirPath).isDirectory()) {
    files = readdirSync(dirPath).map((file) => file);
  } else {
    files = [dirPath];
  }

  const flows = files
    .filter((file) => file.endsWith('js'))
    .map((file) => requireFiles(path.join(dirPath, file)));

  if (!flows.length) throw new Error(`No flows found in ${dirPath}`);
  return flows;
};

const requireFiles = (filePath: string) => {
  if (!filePath) return;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const file = require(filePath);

  return {
    export: file.default || file,
  };
};
