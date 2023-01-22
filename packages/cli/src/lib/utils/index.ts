import {
  existsSync,
  mkdirSync,
  writeFileSync,
  readdirSync,
  unlinkSync,
  lstatSync,
  readFileSync,
} from 'fs';
import path, { join } from 'path';
import { argv } from 'yargs';
import { ROOT_PATH, RC_FILE_NAME, UF_DIR, OUTPUT_DIR } from './constants';

const LH_DIR = path.join(process.cwd(), OUTPUT_DIR);

export const defaultRCPath = join(ROOT_PATH, RC_FILE_NAME);
export const defaultUFDir = join(ROOT_PATH, UF_DIR);
export const defaultOutputFile = join(ROOT_PATH, OUTPUT_DIR);

export const getRcFile = () => {
  const { rcPath, ['rc_path']: rc_path, p } = argv as any;
  const path = rcPath || rc_path || p;

  if (!path) {
    return join(ROOT_PATH, RC_FILE_NAME);
  }

  return path;
};

export const SaveLHR = (jsonResult: string, baseDir = LH_DIR) => {
  const filename = `result-${Date.now()}`;
  const basePath = path.join(baseDir, filename);

  if (createIfNotExists(baseDir)) {
    writeFileSync(`${basePath}.json`, jsonResult);
  }
};

export const cleanLHR = (baseDir = LH_DIR) => {
  if (createIfNotExists(baseDir)) {
    for (const file of readdirSync(baseDir)) {
      const currFile = join(process.cwd(), `${baseDir}/${file}`);
      if (lstatSync(currFile).isDirectory()) {
        cleanLHR(currFile);
      } else {
        unlinkSync(path.join(baseDir, file));
      }
    }
  }
};

export const readLHRFiles = (baseDir = LH_DIR) => {
  const lh_json: any[] = [];

  if (lstatSync(baseDir).isDirectory()) {
    for (const lhFile of readdirSync(baseDir)) {
      const filePath = path.join(baseDir, lhFile);
      lh_json.push(readFileSync(filePath, 'utf8'));
    }
  }
  return lh_json;
};

const createIfNotExists = (baseDir = LH_DIR) => {
  if (!existsSync(baseDir)) mkdirSync(baseDir, { recursive: true });
  return true;
};
