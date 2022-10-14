import { argv } from 'yargs';

export const param = {
  rcPath: {
    alias: 'rc',
    type: 'string',
    description: 'relative path for .pref-monitorrc.json ',
  },
};

export function get(): string {
  const { rcPath: path } = argv as any as { rcPath: string };
  return path;
}
