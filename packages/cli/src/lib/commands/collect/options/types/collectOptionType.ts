import { Page } from 'puppeteer';

export type CollectOptionsType = {
  /** url to run lighthouse on */
  url?: string[];

  /** relative path to the directory where the pref-monitorrc.json
   *  defaults to ./.pref-monitorrc.json
   */
  rcPath?: string;

  /**
   * startServerCommand. Server command to start the server
   */
  startServerCommand?: string;

  /**if true will not save chrome will run not run in headless mode
   * @TODO: --debug will launch the open up the browser with the results
   *
   * defaults to false
   */
  debug?: boolean;

  /** run without running the lighthouse audit */
  dryRun?: boolean;

  /** where this output result is going to sit
   * defaults to ./result.json
   */
  outDir?: string;

  /** weather the application is Single page application.
   */
  isSPA: boolean;

  /** predefined template for login.
   *
   * defaults to null
   */
  template?: Partial<TemplateType>;

  /**build path
   *
   * defaults to ./build
   */
  buildPath: string;

  /**puppeteerPath */
  puppeteerPath?: string;

  /**puppeteerScriptPath*/
  puppeteerScript?: string;

  /**puppeteer user-flow script relative path
   *
   * defaults to ./uf-script
   */
  ufScriptDir: string;

  /**puppeteer options */
  puppeteerOptions?: Record<any, any>;

  /**chrome path relativePath*/
  chromePath?: string;

  /**chrome path relativePath*/
  chromeOptions?: Record<any, any>;

  /**default median run Default=3 */
  defaultMedianRun?: number;

  // /** BATCH run default to false */
  // batchRun?: boolean;
};

export type TemplateType = {
  login: {
    selectors: { usernameSelector: string; passwordSelector: string };
    credentials: { password: string; userName: string };
  };
  cls: {
    /**@TODO  */
  };
  warm_cache: {
    /**@TODO  */
  };
};

export type templateKeys = keyof TemplateType;
export type loadTemplate = Record<
  templateKeys,
  (page: Page, options: any) => void
>;
