import * as chalk from 'chalk';

const log = (messages: string) => {
  process.stdout.write(`${messages}\n`);
};

const messageStatus = {
  info: 'magenta',
  success: 'green',
  error: 'red',
} as const;

export const logging = (
  message: string,
  status?: keyof typeof messageStatus
) => {
  const messageColor: values = messageStatus[status || 'info'];
  const color = chalk[messageColor];
  color(log(message));
};

type key = keyof typeof messageStatus;
type values = typeof messageStatus[key];
