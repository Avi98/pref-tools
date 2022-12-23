import { existsSync, mkdirSync, writeFileSync } from 'fs';
import path, { join } from 'path';
import { argv } from 'yargs';
import { ROOT_PATH, RC_FILE_NAME } from './constants';

export const getRcFile = () => {
  const { rcPath, ['rc_path']: rc_path, p } = argv as any;
  const path = rcPath || rc_path || p;

  if (!path) {
    return join(ROOT_PATH, RC_FILE_NAME);
  }

  return path;
};

const LH_DIR = path.join(process.cwd(), '.lh_results');

export const SaveLHR = (jsonResult: string, baseDir = LH_DIR) => {
  const filename = `result-${Date.now()}`;
  const basePath = path.join(baseDir, filename);

  if (createIfNotExists(basePath)) {
    writeFileSync(`${basePath}.json`, jsonResult);
  }
};

const createIfNotExists = (baseDir = LH_DIR) => {
  if (!existsSync(baseDir)) mkdirSync(baseDir, { recursive: true });
  return true;
};
