import { readLHRFiles } from '../../../utils';
import {
  getAncestorHash,
  getBranch,
  getCommit,
  getCommitAuthor,
  getCommitTime,
  getCurrentHash,
  getHash,
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

const getGitContext = (baseBranch: string) => {
  const hash = getHash();
  const ancestorHash = getAncestorHash(hash, baseBranch);

  return {
    avatarUrl: '',
    ancestorHash: ancestorHash,
    branch: getBranch(),
    commitMessage: getCommit(),
    author: getCommitAuthor(),
    hash: getCurrentHash(),
    committedAt: getCommitTime(hash),
    ancestorCommitTime: getCommitTime(ancestorHash),
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

export type LHReportDto = {
  lhrJson: JSON;
  url: string;
  buildId: number;
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
  const baseBranch = project.baseBranch || 'master';
  const gitContext = getGitContext(baseBranch);

  const currentDate = new Date().toISOString();
  const build = await api
    .post<buildDto>('/addBuild', {
      ancestorCommittedAt: gitContext.ancestorCommitTime,
      ancestorHash: gitContext.ancestorHash,
      branch: gitContext.branch,
      author: gitContext.author,
      avatarUrl: gitContext.avatarUrl,
      commitMessage: gitContext.commitMessage,
      committedAt: gitContext.committedAt,
      externalBuildUrl: '',
      hash: gitContext.hash,
      projectId: project.id,
      runAt: currentDate,
    })
    .catch((e) => {
      throw new Error('Failed to add build');
    });

  if (build) {
    const lh_json = readLHRFiles(path);
    console.log({ build });
    const saveReport = lh_json.map((lh) => {
      if (lh) {
        const lh_op = JSON.parse(lh);
        return api.post<LHReportDto>('/saveReport', {
          projectId: 1,
          lhrJson: lh,
          buildId: build.buildId,
          url: lh_op.finalUrl,
        });
      }
      return null;
    });
    if (saveReport.filter(Boolean).length)
      await Promise.all(saveReport).then((res) => {
        console.log({ res });
      });
  }
};
