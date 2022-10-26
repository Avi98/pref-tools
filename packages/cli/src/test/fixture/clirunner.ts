import { spawn } from 'child_process';

const createProcess = (processPath: string, args: string[], env: any) => {
  args = [processPath].concat(args);

  const childProcess = spawn('node', [...args]);

  const results: result = {
    stdout: '',
    stderr: '',
    status: -1,
    matches: { uuids: [] },
    childProcess: {},
    exitPromise: undefined,
  };

  childProcess.stdout.on('data', (chunk) => {
    results.stdout += chunk.toString();
  });

  childProcess.stderr.on('data', (chunk) => {
    results.stderr += chunk.toString();
  });

  childProcess.once('exit', (code) => {
    results.status = code as number;
  });

  const exitPromise = new Promise((res, rej) =>
    childProcess.once('exit', (code) => {
      if (code === 0) {
        res(results.stdout);
      }
      rej(results.stderr);
    })
  );

  results.exitPromise = exitPromise
    .then(() => {
      results.stdout;
      results.stderr;
    })
    .catch((e) => {
      console.error(e);
    });
  // results.childProcess = childProcess;

  return results;
};

type result = {
  stdout: string;
  stderr: string;
  status: any;
  matches: { uuids: string[] };
  childProcess: object;
  exitPromise: Promise<any> | undefined;
};

export const cliRunner = async (
  processPath: string,
  args: string[],
  opts: any
) => {
  const { env = null } = opts;
  const res = createProcess(processPath, args, env);
  await res.exitPromise;

  return res;
};
