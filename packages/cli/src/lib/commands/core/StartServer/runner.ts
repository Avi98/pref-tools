import { URL } from 'url';
import kill from 'tree-kill';
import { spawn } from 'child_process';
import { CollectOptionsType } from '../../collect/options/types/collectOptionType';
import { FallbackServer } from './FallbackServer';

class Server {
  private startCommand: string;
  private startBuiltInServer: boolean;
  private buildPath: string;
  private waitTill: string;
  private isSpa: boolean;
  private urlAsArray: string[] | null;

  constructor(option: CollectOptionsType) {
    this.startCommand = option.startServerCommand || '';
    this.startBuiltInServer = option.startBuiltInServer || false;
    this.waitTill = option.startServerReadyPattern || '';
    this.buildPath = option.buildPath || '';
    this.isSpa = option.isSPA;
    this.urlAsArray = Array.isArray(option.url)
      ? option.url
      : option.url
      ? [option.url]
      : null;

    this.validateCommands();
  }

  validateCommands() {
    if (this.startBuiltInServer && this.startCommand)
      throw new Error('Can not start built in server and run server command');

    if (this.startBuiltInServer && !this.buildPath)
      throw new Error(' Can start server without build dir path');
  }

  async start() {
    if (this.startCommand) {
      const waitPattern = this.waitTill;
      const cmd = this.startCommand;
      return await this.runCommandAndWait(waitPattern, cmd);
    }

    return await this.startServer(this.buildPath, this.isSpa);
  }

  private async runCommandAndWait(
    waitPattern: string,
    startCommand: string,
    defaultTimeout = 5000
  ) {
    const child_process = spawn(startCommand, { stdio: 'pipe', shell: true });

    const pattern = new RegExp(waitPattern, 'i');
    const timeoutPromise = new Promise((r) => setTimeout(r, defaultTimeout));

    let resolve: (value: unknown) => void;
    let reject: (value: unknown) => void;

    const foundString = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });

    const returnObj = {
      stdout: '',
      stderr: '',
    };

    const stringListener =
      (channel: keyof typeof returnObj) => (chunk: Buffer) => {
        returnObj[channel] += chunk.toString();
        const match = chunk.toString().match(pattern);
        if (match) {
          resolve(returnObj);
        }
      };

    const existListener = (code: number) => {
      if (code) {
        const err = new Error('\nCommand exited with code ' + code + '\n');
        Object.assign(err, returnObj);
        reject(err);
      }
    };

    const stdoutListener = stringListener('stdout');
    const stderrListener = stringListener('stderr');

    child_process.on('exit', existListener);
    child_process.stdout.on('data', stdoutListener);
    child_process.stderr.on('data', stderrListener);

    await Promise.race([timeoutPromise, foundString]);

    return {
      url: this.urlAsArray,
      close: () => {
        return new Promise(
          (res, rej) =>
            child_process.pid &&
            kill(child_process.pid, (err) => {
              if (err) rej(err);
              res('\nkilled process' + child_process.pid);
            })
        );
      },
    };

    /**todo remove event listener for memory leaks */
    // child_process.off('')
  }

  private async startServer(buildPath: string, isSPA: boolean) {
    /**
     * if server command not found serve the
     * start server to serve static build in case of SPAs
     *
     */

    const server = new FallbackServer(buildPath, isSPA);
    await server.listen();

    const urls = server.getAvailableUrls();
    const urlsToRun = urls.map((url) => {
      const newUrl = new URL(url);
      newUrl.port = server.port.toString();
      return newUrl;
    });

    return {
      url: urlsToRun,
      close: () => server.closeServer(),
    };
  }
}

export { Server };
