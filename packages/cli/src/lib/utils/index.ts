import { join } from 'path';
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
