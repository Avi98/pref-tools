export type runType = 'batchRun' | 'numberOfRun' | 'userFlows';
export type BatchRun = BatchWithFile | BatchWithURLs;

export type UserFlowRun = {
  type: 'userFlow';
  filePath: string;
};

type BaseBatch = {
  type: 'Batch';
  lhOptions: string;
  outDir: string;
};

type BatchWithFile = BaseBatch & {
  sitesFilePath: string;
};

type BatchWithURLs = BaseBatch & {
  urls: string | string[];
};

export type NumberOfRuns = {
  numberOfRuns: number;
  type: 'numberOfRun';
  url: string;
};
