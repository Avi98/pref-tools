import { existsSync } from 'fs';
import { join } from 'path';
import { Browser, Page } from 'puppeteer';
import { RcType } from '../../../types/rcJson';
import { logging } from '../../../utils/logging';
import {
  loadTemplate,
  templateKeys,
  TemplateType,
} from '../../collect/options/types/collectOptionType';
import { loadFileDir, resolveFile } from '../utils';

class PuppeteerManager {
  private browser: Browser | null;
  private chromeOptions: object;
  private currentOpenPage: Page | null;
  private puppeteerScript: string | undefined;
  private templateOption: Partial<TemplateType>;
  private userFlowDir: string | null;

  constructor(options: RcType['collect']) {
    this.browser = null;
    this.currentOpenPage = null;
    this.userFlowDir = options?.ufScriptDir || '';
    this.chromeOptions = options.chromeOptions || {};
    this.templateOption = options.template || {};
    if (options.puppeteerScript) this.puppeteerScript = options.puppeteerScript;
  }

  static _requirePuppeteer() {
    try {
      return require('puppeteer');
    } catch (_) {
      console.log('');
    }

    try {
      return require('puppeteer-core');
    } catch (_) {
      console.log('');
    }

    // Try relative to the CWD too in case we're installed globally
    try {
      return require(join(process.cwd(), 'node_modules/puppeteer'));
    } catch (_) {
      console.log();
    }

    try {
      return require(join(process.cwd(), 'node_modules/puppeteer-core'));
    } catch (_) {
      console.log();
    }
  }

  async launchBrowser(): Promise<Browser> {
    const puppeteer = PuppeteerManager._requirePuppeteer();
    if (!puppeteer) {
      throw new Error('Please install puppeteer as dependency');
    }

    const browser = await puppeteer.launch({
      ...this.chromeOptions,
      pipe: false,
      devTools: false,
    });

    this.browser = browser;
    return browser;
  }

  /**
   * NOTE: while creating the template file need to follow this
   * naming conventions.
   * File name and default export function name should be same. (i.e lowercase)
   *
   */
  loadTemplate(option: Partial<TemplateType>): loadTemplate {
    return Object.keys(option).reduce((temp, name) => {
      const path = join(__dirname, `./puppeteerTemplate/${name}.js`);
      if (existsSync(path)) {
        return {
          ...temp,
          [name]: require(join(__dirname, `./puppeteerTemplate/${name}.js`)),
        };
      }
      return temp;
    }, {} as loadTemplate);
  }

  async runTemplate(url: string) {
    if (!Object.keys(this.templateOption).length) return null;

    const template = this.loadTemplate(this.templateOption);
    const browser = await this.launchBrowser();
    const page = await browser.newPage();
    this.currentOpenPage = page;

    (Object.keys(template) as templateKeys[]).forEach((tempName) => {
      if (template[tempName] && this.templateOption[tempName]) {
        template[tempName](page, { ...this.templateOption[tempName], url });
      }
    });
  }

  async runPuppeteerScript(url: string) {
    if (!this.puppeteerScript?.length) return;

    const browser = this.browser ? this.browser : await this.launchBrowser();
    const pageInstance = this.currentOpenPage;

    const puppeteerScript = resolveFile(this.puppeteerScript);

    puppeteerScript(pageInstance, { url, browser });
  }

  async closeBrowser() {
    if (this.currentOpenPage) {
      await this.currentOpenPage.close();
    }
    if (this.browser) await this.browser.close();
  }

  loadUserFlow() {
    if (!this.userFlowDir) return;
    try {
      const flows = loadFileDir(this.userFlowDir);
      return flows;
    } catch (error) {
      throw new Error('user flow file load failed');
    }
  }
}

export default PuppeteerManager;
