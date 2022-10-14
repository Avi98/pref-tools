import { join } from 'path';
import { Options } from 'yargs';
import { OUTPUT_FILE, RC_FILE_NAME, ROOT_PATH } from '../../utils/constants';
import { yargsCommandType } from '../../utils/yargs/types';

const defaultRCPath = join(ROOT_PATH, RC_FILE_NAME);
const defaultOutputFile = join(ROOT_PATH, OUTPUT_FILE);

const collectOptions: Record<string, Options> = {
  url: {
    alias: 'url to run lighthouse on ',
    description: 'url for which pref is required',
    type: 'string',
  },

  rcPath: {
    alias: ['p', 'rc_path', 'rcPath'],
    description: `path where the rc files exist. default will be ${defaultRCPath}`,
    default: defaultRCPath,
    type: 'string',
  },

  debug: {
    alias: '-d',
    description:
      'if true will not save chrome will run not run in headless mode. By default it will be false',
    default: false,
    boolean: true,
    type: 'boolean',
  },
  dryRun: {
    alias: ['-dry'],
    description:
      'will launch the chrome in headFull mode but will not run any lighthouse audit',
    default: false,
    boolean: true,
    type: 'boolean',
  },

  outDir: {
    alias: ['out_dir', 'dir'],
    description:
      'where this output result is going to sit' +
      `default ${defaultOutputFile}`,

    default: defaultOutputFile,
    type: 'string',
  },

  isSpa: {
    requiresArg: true,
    description: 'weather the application is Single page application.',
    type: 'boolean',
  },

  buildPath: {
    requiresArg: true,
    description: 'bath for build dir',
    type: 'string',
  },

  puppeteerPath: {
    alias: ['puppeteerPath', 'p_path'],
    description: 'path to script path',
    default: './puppeteerScripts',
    type: 'string',
  },

  chromePath: {
    alias: ['c_path', 'chrome'],
    description: 'by default puppeteer chrome will be launched',
    requiresArg: false,
    type: 'string',
  },

  defaultMedianRun: {
    alias: ['median', 'runs'],
    type: 'count',
    default: 3,
  },
};

export const collectLHReport: yargsCommandType = {
  command: 'collect',
  description: 'collect the report',
  builder: (y) => y.option(collectOptions),
  module: {
    handler: (argv: any) => {
      console.log({ handle: 'called handle' });
      /**
       * get config.
       *
       * if spa. Get the build path run the server on it.
       * serve the build.
       *
       * inject puppeteer context to all the puppeteer
       */
      // const potential = getConfig(argv);
      console.log({ argv });
    },
  },
};
