import { spawn } from 'child_process';
import path from 'path';
import { logging } from '../../utils/logging';

export function lh() {
  return path.join(
    require.resolve('lighthouse'),
    '../../lighthouse-cli/index.js'
  );
}

export function getMedianResults(runs: unknown[]) {
  const {
    computeMedianRun,
    // eslint-disable-next-line @typescript-eslint/no-var-requires
  } = require('lighthouse/lighthouse-core/lib/median-run.js');

  return computeMedianRun(runs);
}

export function promisifySpawn(
  cmd: string,
  options = [''],
  cleanupCb: VoidFunction
) {
  let resolve: (res: any) => void;
  let reject: (res: any) => void;

  let stdout = '';
  let stderr = '';

  const p = new Promise((r1, r2) => {
    resolve = r1;
    reject = r2;
  });

  logging(`Running \n cmd ${cmd}\n options: ${options}\n`, 'info');
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
