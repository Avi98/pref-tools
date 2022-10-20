import { existsSync, readdirSync } from 'fs';

export const loadFileDir = (pathDir: string) => {
  if (!existsSync(pathDir)) throw new Error('\nFile does not exists.\n');

  let loadFile = [];
  try {
    loadFile = readdirSync(pathDir);
  } catch (error) {
    throw new Error('\nCan not read the directory\n');
  }

  const flow = loadFile.map((filePath) => resolveFile(filePath));

  return flow;
};

export function resolveFile(path: string) {
  if (existsSync(path)) {
    return require(path);
  }
  throw new Error('Resolve file path does not exists');
}
