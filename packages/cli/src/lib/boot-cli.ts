import { existsSync, readFileSync } from 'fs';
import { collectLHReport } from './commands/collect';
import { RcType } from './types/rcJson';
import { getRcFile } from './utils';
import { setupYargs } from './utils/yargs';

const getConfig = (path: string): RcType => {
  if (existsSync(path)) {
    return JSON.parse(readFileSync(path, 'utf8'));
  }

  // throw Error('Rc file not found');
};

/**these options can be run with all cmds */
const basicOptions = {};
const config = getConfig(getRcFile());

/**run cli from here */
(async () => {
  setupYargs({
    commands: [collectLHReport],
    options: basicOptions,
    config: {
      ...config?.collect,
      ...config?.assert,
      ...config?.upload,
    },
  }).argv;
})();
