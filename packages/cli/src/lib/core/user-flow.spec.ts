import { rcConfig } from '../../test/fixture/utils';
import PuppeteerManager from '../commands/core/puppeteer/puppeteerManager';
import LH_UserFlow from './UserFlow';

describe('user flows', () => {
  it('Should load user flow files.', async () => {
    const puppeteerManager = jest.fn() as unknown as PuppeteerManager;
    const uf = LH_UserFlow.create(rcConfig.collect, puppeteerManager);

    const files = await uf.loadUserFlows();
    const fileOption = files.map((file) => file?.export);

    expect(Array.isArray(files)).toBeTruthy();
    expect(fileOption.length).toBeGreaterThan(0);
    expect(Object.keys(fileOption[0])).toEqual(['flowOptions', 'interactions']);
  });
  it('User flow reports should be generated', async () => {
    const puppeteerManager = {
      launchBrowser: () => ({
        newPage: jest.fn(),
        close: jest.fn(),
      }),
    } as unknown as PuppeteerManager;

    const mockUserFlowFiles = {
      export: {
        interactions: jest.fn(),
      },
    };
    const uf = LH_UserFlow.create(rcConfig.collect, puppeteerManager);

    const flows = await uf.collectFlows(mockUserFlowFiles);

    expect(flows._gatherSteps.length).toBe(0);
    expect(flows.name).toBeUndefined();
  });
});
