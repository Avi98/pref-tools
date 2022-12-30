import { Page, PuppeteerNodeLaunchOptions } from 'puppeteer';

export type chromeOptions = PuppeteerNodeLaunchOptions & {
  chromePath: string;
};

export type CollectOptionsType = {
  /**Relative userFlowPath for the userFlow */
  userFlow?: {
    /**puppeteer user-flow script relative path
     *
     * defaults to ./UF_DIR
     */
    userFlowPath: string;

    /** base url on which the user flow reports will be collected */
    url: string;
  };

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

  /** if start server command is provided need
   *  to check if the server is ready before running
   *   Lighthouse
   *
   * */
  startServerReadyPattern?: string;

  /** Start built in server. DO NOT provide startServerCommand
   *  with this value or Collect cmd will throw error.
   *
   */
  startBuiltInServer?: boolean;

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
  buildPath?: string;

  /**puppeteerScriptPath*/
  puppeteerScript?: string;

  /**puppeteer options */
  puppeteerOptions?: Record<any, any>;

  /**chrome path relativePath*/
  chromePath?: string;

  /**chrome path relativePath*/
  chromeOptions?: chromeOptions;

  /**default median run Default=3 */
  defaultMedianRun?: number;

  // /** BATCH run default to false */
  // batchRun?: boolean;
};

export type TemplateType = {
  login: {
    selectors: { usernameSelector: string; passwordSelector: string };
    credentials: { password: string; username: string };
    url: string;
  };
  cls: {
    url: string;
    /**@TODO  */
  };
  warm_cache: {
    url: string;
    /**@TODO  */
  };
};

export type templateKeys = keyof TemplateType;
export type loadTemplate = Record<
  templateKeys,
  (page: Page, options: any) => Promise<void>
>;
