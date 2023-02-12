import { LighthouseRunner } from '../../core/lighthouseRunner';
import { BatchRun } from '../../core/types';
import { cleanLHR } from '../../utils';
import { logging } from '../../utils/logging';
import { getUrlsFromFiles } from './utils/getUrls';

export const handler = async (argv: any) => {
  process?.send?.('start');
  cleanLHR(argv['outDir']);
  if (argv?.sitesFilePath && argv.urls) {
    throw new Error('Sites file and urls both can should not be provided');
  }

  const urlsFromFiles =
    argv?.sitesFilePath && getUrlsFromFiles(argv?.sitesFilePath);

  const config: BatchRun = {
    lhOptions: {},
    outDir: argv.outDir,
    urls: argv.urls || urlsFromFiles,
    type: 'Batch',
  };

  const lh = new LighthouseRunner();
  return await lh.run('batchRun', config).catch((error) => {
    logging(error.message, 'error');
  });
};

export default handler;
