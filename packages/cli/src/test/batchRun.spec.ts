import { cmdRunner } from './fixture/forkScript';
import { cleanLHR, defaultOutputFile, SaveLHR } from '../lib/utils';
import { join } from 'path';

const outputPath = join(process.cwd(), defaultOutputFile);
describe('should genrate the report for urls', () => {
  beforeAll(() => {
    cleanLHR(outputPath);
  });

  afterAll(() => {
    cleanLHR(outputPath);
  });

  it('batch run on the url', async () => {
    const path = join(process.cwd(), './dist/packages/cli/src/lib/boot-cli.js');
    await cmdRunner(path, [
      'batch_lh',
      '-d',
      outputPath,
      '-u',
      'https://www.example.com/',
      'https://web.dev',
      'https://web.dev/',
    ])
      .then((res) => {
        console.log({ ress: res });
      })
      .catch((e) => {
        console.error({ e });
      });
  }, 50_00_000);
});
