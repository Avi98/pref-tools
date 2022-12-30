import { existsSync, readFileSync } from 'fs';
import { logging } from '../../utils/logging';
import { CollectOptionsType } from './options/types/collectOptionType';

//TODO: refactor this
export const getCollectArgs = (
  argv: any
): Record<'collect', CollectOptionsType> => {
  try {
    const {
      rcPath,
      debug,
      url,
      dryRun,
      outDir,
      isSPA,
      buildPath,
      puppeteerPath,
      chromePath,
      defaultMedianRun,
      userFlowPath,
    } = argv;

    return {
      collect: {
        rcPath,
        debug,
        url,
        dryRun,
        outDir,
        isSPA,
        buildPath,
        puppeteerScript: puppeteerPath,
        chromePath,
        defaultMedianRun,
        userFlow: {
          url,
          userFlowPath,
        },
      },
    };
  } catch (e) {
    logging('args not provided');
    throw e;
  }
};

export const readFile = (path: string) => {
  if (existsSync(path)) {
    return JSON.parse(readFileSync(path, { encoding: 'utf8' }));
  }
  throw new Error('File does not exist on the provided path');
};

export const getBaseUrl = (url: URL[] | string[] | string) => {
  const urlArray = Array.isArray(url) ? url : [url];
  return new URL(urlArray[0]).origin;
};

export const getUrlFromBase = (baseUrl: string, route: string) => {
  return new URL(route, baseUrl);
};
