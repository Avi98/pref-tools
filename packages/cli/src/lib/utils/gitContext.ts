import { spawnSync } from 'child_process';

const getRawBranch = () => {
  const result = spawnSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
    encoding: 'utf8',
  });

  const branch = typeof result.stdout === 'string' && result.stdout.trim();
  if (result.status !== 0 || !branch || branch === 'HEAD') {
    throw new Error(
      'Unable to determine current branch with `git rev-parse --abbrev-ref HEAD`. ' +
        'This can be overridden with setting LHCI_BUILD_CONTEXT__CURRENT_BRANCH env.'
    );
  }

  return branch;
};

export const getBranch = () => {
  const branch = getRawBranch();
  if (branch === 'HEAD') throw new Error('Unable to determine current branch');
  return branch.replace('refs/heads/', '').slice(0, 40);
};

export const getCommit = (hash = 'HEAD') => {
  const result = spawnSync('git', ['log', '--format=%s', '-n', '1', hash], {
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    throw new Error('Unable to determine the commit message');
  }

  return result.stdout.trim().slice(0, 80);
};

export const getCommitAuthor = (hash = 'HEAD') => {
  const result = spawnSync(
    'git',
    ['log', '--format=%aN <%aE>', '-n', '1', hash],
    {
      encoding: 'utf8',
    }
  );
  if (result.status !== 0) {
    throw new Error('Unable to determine the authore');
  }

  return result.stdout.trim().slice(0, 256);
};
const getAncestorHashForBase = (hash: string) => {
  const result = spawnSync('git', ['rev-parse', `${hash}^`], {
    encoding: 'utf8',
  });
  // Ancestor hash is optional, so do not throw if it can't be computed.
  // See https://github.com/GoogleChrome/lighthouse-ci/issues/36
  if (result.status !== 0) return '';

  return result.stdout.trim();
};

const runCommandsUntilFirstSuccess = (commands: (string | string[])[][]) => {
  let result;

  for (const [command, args] of commands) {
    if (typeof command === 'string' && Array.isArray(args))
      result = spawnSync(command, args, { encoding: 'utf8' });

    if (result?.status === 0) break;
  }

  if (!result) throw new Error('Must specify at least one command');
  return result;
};

export const getAncestorHashForBranch = (hash: string, baseBranch: string) => {
  const cmd = [
    ['git', ['merge-base', hash, `origin/${baseBranch}`]],
    ['git', ['merge-base', hash, baseBranch]],
  ];
  const result = runCommandsUntilFirstSuccess(cmd);

  if (result.status !== 0) return '';

  return result.stdout.trim();
};
export const getAncestorHash = (hash: string, baseBranch: string) => {
  return getBranch() === baseBranch
    ? getAncestorHashForBase(hash)
    : getAncestorHashForBranch(hash, baseBranch);
};
