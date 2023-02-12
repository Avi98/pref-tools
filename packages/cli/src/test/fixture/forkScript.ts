import { spawn } from 'child_process';

export const cmdRunner = (cmdPath: string, args = ['']) => {
  let resolve: (stdout: string) => void;
  let reject: (stdError: string) => void;

  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  const cp = spawn('node', [cmdPath, ...args]);
  console.log({ cmdPath });

  let stdout = '';
  let stdError = '';

  cp.stdout?.on('data', (data) => {
    console.log({ data: data.toString() });
    stdout += data.toString();
  });

  cp.stderr?.on('data', (error) => {
    console.log({ error: error.toString() });
    stdError += error.toString();
  });

  cp.on('exit', (code) => {
    if (code !== 0) {
      console.log('code--->', code);
      return reject(stdError);
    }
    console.log({ code });
    return resolve(stdout);
  });
  return promise;
};
