import { logging } from '../../utils/logging';
import { yargsCommandType } from '../../utils/yargs/types';
import { readUploadResults } from './core/readUpload';
import { uploadOptions } from './options';

export const uploadReport: yargsCommandType = {
  command: 'upload_lh',
  description: 'collected report will be uploaded',
  builder: (y) => y.option(uploadOptions),
  module: {
    handler: async (arg) => {
      logging('uploading reports');
      if (!arg['token']) return logging('no token provided skipping upload');

      await readUploadResults(arg['token'] as string, arg['lh_dir'] as string);
    },
  },
};
