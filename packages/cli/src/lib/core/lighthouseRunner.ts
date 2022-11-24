import { LH_Run } from './lighthouse';
import type {
  BatchRun,
  BatchRun as BatchRunType,
  NumberOfRuns,
  runType,
  UserFlowRun,
} from './types';

class LighthouseRunner {
  async run(runFor: runType, config: BatchRun | NumberOfRuns | UserFlowRun) {
    switch (runFor) {
      case 'batchRun':
        if (config.type === 'Batch') return this.batchRun(config);
        break;
      case 'numberOfRun':
        if (config.type === 'numberOfRun') return this.runUntilSuccess(config);
        break;

      // case 'userFlows':
      //   if ('filePath' in config) return this.userFlowsRun(config);
      //   break;

      default:
        throw new Error('Invalid lighthouse run');
    }
  }

  private runUntilSuccess(config: NumberOfRuns) {
    const numberOfRuns = config.numberOfRuns || 3;

    const lh = new LH_Run(config);
    for (let i = 0; i++; i <= numberOfRuns) {}
  }
  private batchRun(config: BatchRunType) {
    return new LH_Run(config).execute();
  }
  // private medianRun(config: medianRun) {}
  // private userFlowsRun(config: UserFlowRun) {}
}

export { LighthouseRunner };
