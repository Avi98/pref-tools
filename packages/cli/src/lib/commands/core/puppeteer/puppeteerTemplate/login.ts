import { Page } from 'puppeteer';
import { logging } from '../../../../utils/logging';
import { TemplateType } from '../../../collect/options/types/collectOptionType';
type Context = TemplateType['login'];

async function login(page: Page, context: Context) {
  const loginUrl = context.url;
  const {
    selectors: { usernameSelector = '', passwordSelector = '' },
    credentials: { password, username },
  } = context;
  logging('login template launched on url:' + context.url, 'success');

  if (!usernameSelector || !passwordSelector || !password || !username) return;
  await page.goto(loginUrl);
  await page.setDefaultNavigationTimeout(0);

  await page.waitForSelector(usernameSelector);
  await page.type(usernameSelector, username);
  await page.type(passwordSelector, password);
  await page.click("button[type='submit']");
  await page.waitForNavigation();

  await page.goto(context.url, { waitUntil: 'networkidle0' });
}

export default login;
