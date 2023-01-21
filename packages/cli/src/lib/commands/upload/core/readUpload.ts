import { readLHRFiles } from '../../../utils';
import {
  getAncestorHash,
  getBranch,
  getCommit,
  getCommitAuthor,
} from '../../../utils/gitContext';
import { APIService } from './apiService';

const getTokenApi = (token: string) => {
  const api = new APIService({
    baseUrl: 'http://localhost:3000/',
    extraHeader: {
      'Content-Type': 'application/json',
    },
  });
  api.setToken(token);
  return api;
};

const getGitContext = ({
  hash,
  baseBranch,
}: {
  hash: string;
  baseBranch: string;
}) => {
  return {
    branch: getBranch(),
    commitMessage: getCommit(),
    avatarUrl: '',
    hash: getAncestorHash(hash, baseBranch),
    committedAt: '',
    author: getCommitAuthor(),
  };
};

export type buildDto = {
  ancestorCommittedAt: string;
  ancestorHash: string;
  author: string;
  avatarUrl: string;
  branch: string;
  committedAt: string;
  commitMessage: string;
  externalBuildUrl: string;
  hash: string;
  runAt: string;
  projectId: number;
};

export const readUploadResults = async (token: string, path: string) => {
  /**
   * get project info by token
   * get git context
   * create build in DB.
   * create result in DB link with build
   */
  const api = getTokenApi(token);

  //@TODO
  // const project = await api.get(`/project-by-token/${token}`);
  // if (!project) throw new Error('Project not found');

  const project = {
    hash: '',
    id: 1,
    baseBranch: 'feat/test-cli',
  };
  const gitContext = getGitContext({
    hash: project.hash,
    baseBranch: project.baseBranch,
  });

  const currentDate = new Date().toISOString();
  await api
    .post<buildDto>('/addBuild', {
      //@todo
      ancestorCommittedAt: currentDate,
      ancestorHash: gitContext.hash,
      branch: gitContext.branch,
      author: gitContext.author,
      avatarUrl: gitContext.avatarUrl,
      commitMessage: gitContext.commitMessage,
      //@todo
      committedAt: currentDate,
      externalBuildUrl: '',
      hash: gitContext.hash,
      projectId: project.id,
      runAt: currentDate,
    })
    .catch((e) => {});

  const results = readLHRFiles(path);
};
