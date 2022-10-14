export type CollectOptionsType = {
  /** url to run lighthouse on */
  url?: string;

  /** relative path to the directory where the pref-monitorrc.json
   *  defaults to ./.pref-monitorrc.json
   */
  rcPath?: string;

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

  /**puppeteer script relative path
   *
   * defaults to ./puppeteerScripts
   */
  puppeteerDir: string;

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
  LOGIN: {
    usernameSelector: string;
    passwordSelector: string;
    submitButton: string;
  };
  CLS: {
    /**@TODO  */
  };
  WARM_CACHE: {
    /**@TODO  */
  };
};
