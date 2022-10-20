import { existsSync, readFileSync } from 'fs';

export const getCollectArgs = (argv: any) => {
  const {
    rcPath,
    debug,
    url,
    dryRun,
    outDir,
    isSpa,
    buildPath,
    puppeteerPath,
    chromePath,
    defaultMedianRun,
  } = argv;

  return {
    collect: {
      rcPath,
      debug,
      url,
      dryRun,
      outDir,
      isSpa,
      buildPath,
      puppeteerPath,
      chromePath,
      defaultMedianRun,
    },
  };
};

export const readFile = (path: string) => {
  if (existsSync(path)) {
    return JSON.parse(readFileSync(path, { encoding: 'utf8' }));
  }
  throw new Error('File does not exist on the provided path');
};
