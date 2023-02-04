import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

export const getUrlsFromFiles = (filePath: string) => {
  const path = join(process.cwd(), filePath);

  if (existsSync(path)) {
    const rawPaths = readFileSync(filePath, 'utf8');
    if (!Array.isArray(rawPaths) || !rawPaths.length)
      throw new Error(
        'URL_FROM_FILE: Path provided is either empty or invalid formate. Please provide urls separated by ,'
      );
    return rawPaths.split(',');
  }
  throw new Error('URL_FROM_FILE: File path does not exist');
};
