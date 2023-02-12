import { SaveLHR } from '../utils';
import { logging } from '../utils/logging';
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
      default:
        throw new Error('Invalid lighthouse run');
    }
  }

  private async runNumberOfTime(config: NumberOfRuns) {
    const lh = new LH_Run(config);
    return await lh.execute(config.numberOfRuns, config.urls);
  }
  private async batchRun(config: BatchRunType) {
    const urls = Array.isArray(config.urls) ? config.urls : [config.urls];
    const results = [];
    for (const url of urls) {
      logging(`running on ${url}`);

      const stdout = await new LH_Run(config).execute(1, url);
      if (config['outDir']) {
        SaveLHR(JSON.stringify(stdout), config['outDir']);
      } else {
        results.push(stdout);
      }
    }
    return results;
  }
}

export { LighthouseRunner };
