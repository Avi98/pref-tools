import path from 'path';
import { LighthouseRunner } from '../lib/core/lighthouseRunner';
import { BATCH_URLS } from './fixture/utils';

const OUT_DIR = path.join(process.cwd(), './report.json');

describe('lighthouse module', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    //@TODO: run the clean up function for cleaning the lighthouse generated report
  });
  it('should do batch run on multiple urls and on single url', async () => {
    const runner = new LighthouseRunner();
    const lh_results = await runner.run('batchRun', {
      type: 'Batch',
      lhOptions: {},
      outDir: OUT_DIR,
      sitesFilePath: '',
      urls: BATCH_URLS,
    });
    const batchResults = JSON.parse(lh_results as string);

    expect(BATCH_URLS.includes(batchResults.requestedUrl)).toBeTruthy();
  }, 50_000);

  it('should be run 3 time', async () => {
    const spy = jest.spyOn(process.stdout, 'write');
    const runner = new LighthouseRunner();

    await runner.run('numberOfRun', {
      type: 'numberOfRun',
      lhOptions: {},
      numberOfRuns: 1,
      outDir: OUT_DIR,
      urls: BATCH_URLS[0],
    });

    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls.flat()).toEqual(
      expect.arrayContaining([
        '\nLighthouse ran for 1 on https://jestjs.io/\n\n',
      ])
    );
  }, 50_000);
  it('should identify user-flow scripts and generate report based on it', () => {});
});
