import { existsSync, lstatSync, readdirSync } from 'fs';
import path from 'path';
import PuppeteerManager from '../commands/core/puppeteer/puppeteerManager';
import { RcType } from '../types/rcJson';
import { startFlow, userFlow } from './lighthouseUf';

class LH_UserFlow {
  #config: RcType['collect'];
  #ufDirPath: string;
  #puppeteer: PuppeteerManager;

  constructor(config: RcType['collect'], puppeteer: PuppeteerManager) {
    this.#config = config;
    this.#puppeteer = puppeteer;
    if (!config.userFlow?.userFlowPath)
      throw new Error('no user flow path was provided');
    this.#ufDirPath = path.join(process.cwd(), config.userFlow?.userFlowPath);
  }

  static create(config: RcType['collect'], puppeteer: PuppeteerManager) {
    return new LH_UserFlow(config, puppeteer);
  }

  async loadUserFlows() {
    const ufDirPath = this.#ufDirPath;

    if (!existsSync(ufDirPath)) {
      throw new Error('user flow path do not exist');
    }

    let files: string[] = [];
    if (lstatSync(ufDirPath).isDirectory()) {
      files = readdirSync(ufDirPath).map((file) => file);
    } else {
      files = [ufDirPath];
    }

    const flows = files
      .filter((file) => file.endsWith('js'))
      .map((file) => this.requireFiles(path.join(ufDirPath, file)));

    if (!flows.length) throw new Error(`No flows found in ${ufDirPath}`);
    return flows;
  }

  async collectFlows(uf: any) {
    const config = this.#config;
    const puppeteer = this.#puppeteer;

    const browser = await puppeteer.launchBrowser();
    const page = await browser.newPage();
    const flow = await startFlow(page, config);

    const interaction = uf.export.interactions;
    await interaction({ page, flow, browser, collectOptions: config.userFlow });
    await browser.close();
    return flow;
  }

  async generateReport(flow: userFlow) {
    if (!flow) throw new Error('No user flow was provided');

    const report = await flow.createFlowResult();
    return JSON.stringify(report);
  }

  private requireFiles(path: string) {
    if (!path) return;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const file = require(path);
    return {
      export: file.default || file,
    };
  }
}

export default LH_UserFlow;
