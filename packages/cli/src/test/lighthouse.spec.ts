import path from 'path';
import { LighthouseRunner } from '../lib/core/lighthouseRunner';
import { BATCH_URLS } from './fixture/utils';

describe('lighthouse module', () => {
  afterEach(() => {
    //@TODO: run the clean up function for cleaning the lighthouse generated report
  });
  it('should do batch run on multiple urls and on single url', async () => {
    const runner = new LighthouseRunner();
    const batchResults = await runner.run('batchRun', {
      type: 'Batch',
      lhOptions: '',
      outDir: path.join(process.cwd(), './report.json'),
      sitesFilePath: '',
      urls: BATCH_URLS,
    });
    console.log(batchResults);
  }, 50_000);
  it('should do do median run if median run is provided', () => {});
  it('should identify user-flow scripts and generate report based on it', () => {});
});
