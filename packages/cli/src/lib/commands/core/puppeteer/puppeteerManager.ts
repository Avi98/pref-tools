import { existsSync } from 'fs';
import { join } from 'path';
import { Browser, Page, executablePath } from 'puppeteer';
import { RcType } from '../../../types/rcJson';
import { logging } from '../../../utils/logging';
import {
  chromeOptions,
  CollectOptionsType,
  loadTemplate,
  templateKeys,
  TemplateType,
} from '../../collect/options/types/collectOptionType';
import { getUrlFromBase } from '../../collect/utils';
import { resolveFile } from '../utils';

const isHeadless = (option: CollectOptionsType) => {
  if (option.debug || option.chromeOptions?.headless) {
    return false;
  }
  return true;
};

class PuppeteerManager {
  private browser: Browser | null;
  private chromeOptions: chromeOptions;
  private currentOpenPage: Page | null;
  private puppeteerScript: string | undefined;
  private templateOption: Partial<TemplateType>;
  private userFlowDir: string | null;

  constructor(options: RcType['collect']) {
    this.browser = null;
    this.currentOpenPage = null;
    this.userFlowDir = options?.ufScriptDir || '';
    this.chromeOptions =
      Object.assign({}, options.chromeOptions, {
        headless: isHeadless(options),
      }) || {};
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

  static getDefaultChromePath(options: CollectOptionsType) {
    // if (!options.puppeteerScript) return;
    if (options.chromePath && existsSync(options.chromePath))
      return options.chromePath;

    const puppeteer: { executablePath: typeof executablePath } =
      PuppeteerManager._requirePuppeteer();
    const chromePath = puppeteer?.executablePath();
    return existsSync(chromePath) ? chromePath : undefined;
  }

  async launchBrowser(): Promise<Browser> {
    try {
      const puppeteer = PuppeteerManager._requirePuppeteer();
      if (!puppeteer) {
        throw new Error('Please install puppeteer as dependency');
      }

      const browser = await puppeteer.launch({
        pipe: false,
        devTools: false,
        executablePath: this.chromeOptions['chromePath'],
        defaultViewport: {
          isMobile: true,
          isLandscape: false,
          width: 800,
          height: 600,
        },
        ...this.chromeOptions,
      });

      await browser.userAgent();
      this.browser = browser;

      return browser;
    } catch (error) {
      logging('error while running puppeteer');
      throw error;
    }
  }

  /**
   * NOTE: while creating the template file need to follow this
   * naming conventions.
   * File name and default export function name should be same. (i.e lowercase)
   *
   */
  private loadTemplate(option: Partial<TemplateType>): loadTemplate {
    return Object.keys(option).reduce((temp, name) => {
      const path = join(__dirname, `./puppeteerTemplate/${name}.js`);
      if (existsSync(path)) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const template = require(join(
          __dirname,
          `./puppeteerTemplate/${name}.js`
        ));
        return {
          ...temp,
          [name]: template.default,
        };
      }
      return temp;
    }, {} as loadTemplate);
  }

  async runTemplate(baseUrl: string) {
    if (!Object.keys(this.templateOption).length) return;
    if (!this.browser) return;

    const template = this.loadTemplate(this.templateOption);
    const option = this.templateOption;
    const page = this.currentOpenPage || (await this.browser.newPage());
    this.currentOpenPage = page;

    for (const tempName of Object.keys(template) as templateKeys[]) {
      const redirectURL = option[tempName]?.url;
      const templateName = template[tempName];
      if (template[tempName] && option[tempName]) {
        await templateName(page, {
          ...option[tempName],
          url: getUrlFromBase(baseUrl, redirectURL || '').href,
        });
      }
    }
  }

  async runPuppeteerScript(url: string) {
    if (!this.puppeteerScript?.length) return;

    const browser = this.browser || (await this.launchBrowser());
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
}

export default PuppeteerManager;
