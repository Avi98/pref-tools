export type runType = 'batchRun' | 'medianRun' | 'userFlows';
export type BatchRun = BatchWithFile | BatchWithURLs;

export type medianRun = {
  type: 'median';
  median: number;
  url: string;
};

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
