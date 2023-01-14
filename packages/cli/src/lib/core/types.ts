export type runType = 'batchRun' | 'numberOfRun' | 'userFlows';
export type BatchRun = BatchWithFile | BatchWithURLs;

export type UserFlowRun = {
  type: 'userFlow';
  filePath: string;
};

type BaseBatch = {
  type: 'Batch';
  lhOptions: object;
  outDir: string;
  urls: string | string[];
};

type BatchWithFile = BaseBatch & {
  sitesFilePath: string;
};

type BatchWithURLs = BaseBatch & {
  urls: string | string[];
};

export type NumberOfRuns = {
  type: 'numberOfRun';
  numberOfRuns: number;
  urls: string;
  outDir: string;
  lhOptions: object;
};
