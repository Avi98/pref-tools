import { join } from 'path';
import { cliRunner } from './fixture/clirunner';

export const CLI_PATH = join(
  __dirname,
  '../../../../dist/packages/cli/src/cli.js'
);

export const PREF_MONITOR_RC = join(__dirname, './fixture/pref-monitorrc.json');

const collectCommand = ['collect'];

describe('collect command', () => {
  it('run collect command', async () => {
    const res = await cliRunner(
      CLI_PATH,
      [...collectCommand, '-p', PREF_MONITOR_RC],
      { env: null }
    );
    console.log({ resStd: res.stdout });
  });

  it('should start server when startBuiltInServer is provided', () => {});
  it('should run the command to start server when start server command is provided ', () => {});
  it('puppeteer template should be run when template name is provided', () => {});
  it('user flow script should be executed and lighthouse report should be collected', () => {});
});
