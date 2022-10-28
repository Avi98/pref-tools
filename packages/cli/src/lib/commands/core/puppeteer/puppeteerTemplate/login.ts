import { Page } from 'puppeteer';

type Context = {
  selectors: { usernameSelector: string; passwordSelector: string };
  credentials: { password: string; userName: string };
  url: string;
};

async function login(page: Page, context: Context) {
  const loginUrl = context.url;
  const {
    selectors: { usernameSelector = '', passwordSelector = '' },
    credentials: { password, userName },
  } = context;
  if (!usernameSelector || !passwordSelector || !password || !userName) return;
  await page.goto(loginUrl);
  await page.setDefaultNavigationTimeout(0);

  await page.waitForSelector(usernameSelector);
  await page.type(usernameSelector, userName);
  await page.type(passwordSelector, password);
  await page.click("button[type='submit']");
  await page.waitForNavigation();

  await page.goto(context.url, { waitUntil: 'networkidle0' });
}

export default login;
