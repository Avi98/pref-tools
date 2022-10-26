import { join } from 'path';
import compression from 'compression';
import express, { Express } from 'express';
import { readdirSync, statSync } from 'fs';
import { createServer, Server } from 'http';

const IGNORED_FOLDERS_FOR_AUTOFIND = new Set([
  'node_modules',
  'bower_components',
  'jspm_packages',
  'web_modules',
  'tmp',
]);

export class FallbackServer {
  private buildDirPath: string;
  private app: Express;
  private portNumber: number;
  private server: undefined | Server;

  constructor(buildDirPath: string, isSPA: boolean) {
    this.buildDirPath = buildDirPath;
    this.portNumber = 0;

    this.app = express();
    this.app.use(compression());
    this.app.use('/', express.static(buildDirPath));
    this.app.use('/app', express.static(buildDirPath));

    if (isSPA) {
      this.app.use('/*', (req, res) =>
        res.sendFile(buildDirPath + '/index.html')
      );
    }
  }

  listen() {
    const server = createServer(this.app);
    this.server = server;

    return new Promise((res, rej) => {
      server.listen(0, () => {
        const serverAddress = server.address();
        if (typeof serverAddress === 'string' || !serverAddress) {
          return rej(new Error(`\nInvalid server address ${serverAddress}\n`));
        }

        this.portNumber = serverAddress.port;
        res('started server');
      });
    });
  }

  get port() {
    return this.portNumber;
  }

  async closeServer() {
    const server = this.server;

    return new Promise((resolve, reject) => {
      server?.close((err) => {
        if (err) reject(err);
        resolve('Closed server successfully');
      });
    });
  }

  getAvailableUrls() {
    const htmlFiles = FallbackServer.getHTMLFile(this.buildDirPath, 2);
    return htmlFiles.map(
      ({ file }) => `http://localhost:${this.portNumber}/${file}`
    );
  }

  static getHTMLFile(directory: string, depth: number) {
    const filesAndFolders = readdirSync(directory, { withFileTypes: true });

    const files = filesAndFolders
      .filter((fileOrDir) => fileOrDir.isFile())
      .map((file) => file.name);
    const folders = filesAndFolders
      .filter((fileOrDir) => fileOrDir.isDirectory())
      .map((dir) => dir.name);

    const htmlFiles = files
      .filter((file) => file.endsWith('.html'))
      .map((file) => ({ file, depth: 0 }));

    if (depth === 0) return htmlFiles;

    for (const folder of folders) {
      // Don't recurse into hidden folders, things that look like files, or dependency folders
      if (folder.includes('.')) continue;
      if (IGNORED_FOLDERS_FOR_AUTOFIND.has(folder)) continue;

      try {
        const fullPath = join(directory, folder);
        if (!statSync(fullPath).isDirectory()) continue;

        htmlFiles.push(
          ...FallbackServer.getHTMLFile(fullPath, depth - 1).map(
            ({ file, depth }) => {
              return { file: `${folder}/${file}`, depth: depth + 1 };
            }
          )
        );
      } catch (err) {
        console.log(err);
      }
    }

    return htmlFiles;
  }
}
