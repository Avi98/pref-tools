import path from 'path';
import { spawn } from 'child_process';
import { createHash } from 'crypto';
import { existsSync, mkdirSync, readdirSync, unlinkSync } from 'fs';
import { logging } from '../utils/logging';
import type {
  BatchRun as BatchRunType,
  medianRun,
  runType,
  UserFlowRun,
} from './types';

class LighthouseRunner {
  async run(runFor: runType, config: BatchRunType | medianRun | UserFlowRun) {
    switch (runFor) {
      case 'batchRun':
        if (config.type === 'Batch') return this.batchRun(config);
        break;
      // case 'medianRun':
      //   if ('median' in config) return this.medianRun(config);
      //   break;

      // case 'userFlows':
      //   if ('filePath' in config) return this.userFlowsRun(config);
      //   break;

      default:
        throw new Error('Invalid lighthouse run');
    }
  }

  private batchRun(config: BatchRunType) {
    return new BatchRun(config).execute();
  }
  // private medianRun(config: medianRun) {}
  // private userFlowsRun(config: UserFlowRun) {}
}

class BatchRun {
  options: BatchRunType;
  constructor(config: BatchRunType) {
    this.options = config;
  }

  async execute() {
    const outDir = this.options.outDir;
    if (this.deleteAndCreateNewDir(outDir)) {
      //change this to forEach as it will have stop on
      for (const site of this.sitesInfo(this.options)) {
        if (!site.url) continue;

        const lh_script = lh();
        const lh_options = this.options.lhOptions;
        const flags = lh_options.includes('--chrome-flags=')
          ? ''
          : [`--chrome-flags`, '--no-sandbox', '--headless', '--disable-gpu'];

        const cmd = ['--output', 'json', '--output-path', 'stdout', ...flags];

        logging(`Started running lighthouse on "${site.url}"`, 'success');
        await promisifySpawn(
          'node',
          [lh_script, site.url, '--verbose', ...cmd],
          () => null
        ).catch((e) => {
          logging(`Failed to generate the report for ${site.url}`, 'error');
          throw e;
        });
      }
    }
  }

  private getOrigin(site: string): string {
    const maxLength = 100;
    let name = site
      .replace(/^https?:\/\//, '')
      // eslint-disable-next-line no-useless-escape
      .replace(/[\/\?#:\*\$@\!\.]/g, '_');

    if (name.length > maxLength) {
      const hash = createHash('sha1').update(name).digest('hex').slice(0, 7);

      name = name.slice(0, maxLength).replace(/_+$/g, ''); // trim any `_` suffix
      name = `${name}_${hash}`;
    }
    return name;
  }

  private sitesInfo(option: BatchRunType) {
    let sites: string[] = [];
    //same origins files should be serialized in same files;
    const sameOrigins: Record<string, boolean> = {};

    if ('urls' in option) {
      sites = Array.isArray(option.urls) ? option.urls : [option.urls];
    }

    return sites.reduce<{ url: string; origin: string; fileName: string }[]>(
      (sites, url, index) => {
        const origin = this.getOrigin(url);
        let fileName = origin;
        while (sameOrigins[origin] === true) {
          fileName = `${fileName}_${index}`;
        }
        sameOrigins[origin] = true;

        return [
          ...sites,
          {
            url,
            origin,
            fileName,
          },
        ];
      },
      []
    );
  }

  private deleteAndCreateNewDir(filePath: string) {
    try {
      if (existsSync(filePath)) {
        const files = readdirSync(filePath);
        files.forEach((f) => {
          if (f) {
            const file = path.join(filePath, f);
            logging(`removing old report file ${f} from ${filePath}`);
            unlinkSync(file);
          }
        });
        return true;
      }
      mkdirSync(filePath);
      return true;
    } catch (error) {
      logging(`Error while creating the report files dir`, 'error');
      throw error;
    }
  }
}

function lh() {
  return path.join(
    require.resolve('lighthouse'),
    '../../lighthouse-cli/index.js'
  );
}

function promisifySpawn(cmd: string, options = [''], cleanupCb: VoidFunction) {
  let resolve: (res: any) => void;
  let reject: (res: any) => void;

  let stdout = '';
  let stderr = '';

  const p = new Promise((r1, r2) => {
    resolve = r1;
    reject = r2;
  });

  logging(`Running cmd ${cmd} ${options}`, 'info');
  const child_process = spawn(cmd, options, {
    cwd: process.cwd(),
  });

  child_process.stderr.on('error', (err) => (stderr += err.toString()));

  child_process.stdout.on('data', (chuck) => (stdout += chuck.toString()));

  child_process.on('exit', (code) => {
    cleanupCb();
    if (code === 0) {
      resolve(stdout);
    }

    if (
      code === 1 &&
      stderr.includes('Generating results...') &&
      stderr.includes('Chrome could not be killed')
    ) {
      resolve(stderr);
    }

    const error = new Error(`\nwhile running the lighthouse ${code}\n`);
    reject(error);
  });

  return p;
}
export { LighthouseRunner };
