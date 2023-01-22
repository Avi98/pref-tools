import { OUTPUT_DIR } from '../../../utils/constants';
import { UploadOptionType } from './types';

export const uploadOptions: UploadOptionType = {
  token: {
    type: 'string',
    description: 'Server token for the project.',
    alias: '-t',
  },
  lh_dir: {
    type: 'string',
    description: 'Path to directory for the results.',
    alias: '-p',
    default: OUTPUT_DIR,
  },
};
