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
        if (config.type === 'numberOfRun') return this.runNumberOfTime(config);
        break;

      // case 'userFlows':
      //   if ('filePath' in config) return this.userFlowsRun(config);
      //   break;

      default:
        throw new Error('Invalid lighthouse run');
    }
  }

  private async runNumberOfTime(config: NumberOfRuns) {
    let stdout;

    const numberOfRuns = config.numberOfRuns || 3;
    const lh = new LH_Run(config);

    for (let i = 0; i <= numberOfRuns; i++) {
      stdout = await lh.execute(i);
    }
    return stdout;
  }
  private async batchRun(config: BatchRunType) {
    const stdout = await new LH_Run(config).execute();
    return stdout;
    //@TODO write to outdir
  }
  // private medianRun(config: medianRun) {}
  // private userFlowsRun(config: UserFlowRun) {}
}

export { LighthouseRunner };
