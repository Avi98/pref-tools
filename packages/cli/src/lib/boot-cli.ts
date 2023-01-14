import { existsSync, readFileSync } from 'fs';
import { cleanUp } from './commands/cleanResults';
import { collectLHReport, collectUFReport } from './commands/collect';
import { getRcFile } from './utils';
import { logging } from './utils/logging';
import { setupYargs } from './utils/yargs';

const getConfig = (path: string) => {
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
  logging(`CLI args will override the config file's configuration`);
  setupYargs({
    commands: [collectLHReport, collectUFReport, cleanUp],
    options: basicOptions,
    config: {
      ...config?.collect,
      ...config?.assert,
      ...config?.upload,
    },
  }).argv;
})();
