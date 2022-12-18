import { join } from 'path';
import * as cliPromptTest from 'cli-prompts-test';

export const CLI_PATH = join(
  __dirname,
  '../../../../dist/packages/cli/src/cli.js'
);

export const PREF_MONITOR_RC = join(__dirname, '.pref-monitorrc');

const collectCommand = ['collect', '-p'];

describe('collect command', () => {
  // it('run collect command', async () => {
  //   const { exitCode, stdout, stderr } = await cliPromptTest(
  //     [CLI_PATH, ...collectCommand],
  //     PREF_MONITOR_RC,
  //     [],
  //     { env: null }
  //   );
  //   expect(stderr).toBe('');
  //   expect(exitCode).toBe(0);
  // }, 90_000);

  it('should start server when startBuiltInServer is provided', async () => {
    // const { exitCode, stdout, stderr } = await cliPromptTest(
    //   [CLI_PATH, ...collectCommand],
    //   PREF_MONITOR_RC,
    //   [],
    //   { env: null }
    // );
    // expect(stderr).toBe('');
    // expect(exitCode).toBe(0);
  });
  it('should run the command to start server when start server command is provided ', () => {});
  it('puppeteer template should be run when template name is provided', () => {});
  it('user flow script should be executed and lighthouse report should be collected', () => {});
});
