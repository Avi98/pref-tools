import path from 'path';

export const BATCH_FILE = path.join(process.cwd(), './batchTestURLs.txt');
export const BATCH_URLS = [
  'https://jestjs.io/',
  'https://www.scientificamerican.com',
  'https://www.udemy.com/',
  'https://www.wayfair.com/',
  'https://www.usnews.com/',
];

const prefConfigFilePath = path.join(process.cwd(), '.pref-monitorrc.json');
// eslint-disable-next-line @typescript-eslint/no-var-requires
export const rcConfig = require(prefConfigFilePath);
