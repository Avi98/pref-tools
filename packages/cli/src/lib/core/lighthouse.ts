import path from 'path';
import { createHash } from 'crypto';
import { existsSync, mkdirSync, readdirSync, unlinkSync } from 'fs';
import { logging } from '../utils/logging';
import { getMedianResults, lh, promisifySpawn } from './utils';
import { BatchRun, NumberOfRuns } from './types';

type LH_OptionType = BatchRun | NumberOfRuns;

export class LH_Run {
  options: LH_OptionType;
  constructor(config: LH_OptionType) {
    this.options = config;
  }

  async execute(numberOfRuns = 3, url: string) {
    const results: unknown[] = [];

    //@TODO change this to forEach as it will have stop on
    // for (const site of this.sitesInfo(this.options)) {
    for (let run = 1; run <= numberOfRuns; run++) {
      if (!url) continue;

      const lh_script = lh();
      const lh_options = Object.entries(this.options.lhOptions).flat();
      const flags = lh_options.includes('--chrome-flags')
        ? []
        : //@TODO: run this in head-full mode when debug option is provided
          [`--chrome-flags`, `" --headless --disable-gpu --no-sandbox"`];

      const cmd = ['--output', 'json', '--output-path', 'stdout'];

      logging(`Started running lighthouse on "${url}"`, 'success');

      await promisifySpawn(
        'node',
        [lh_script, url, ...cmd, ...flags, ...lh_options],
        () => null
      )
        .then((std) => {
          const successMessage = numberOfRuns
            ? `Lighthouse run: ${numberOfRuns} on ${url}`
            : `Lighthouse ran in ${url}`;
          logging(successMessage);
          if (typeof std === 'string') results.push(JSON.parse(std));
        })
        .catch((e) => {
          logging(`Failed to generate the report for ${url}`, 'error');
          throw e;
        });
    }
    const medianResults = getMedianResults(results);
    return medianResults;
  }

  private getOrigin(site: string): string {
    const maxLength = 100;
    let name = site
      .replace(/^https?:\/\//, '')
      // eslint-disable-next-line no-useless-escape
      .replace(/[\/\?#:\*\$@\!\.]/g, '_');

    if (name.length > maxLength) {
      const hash = createHash('sha1').update(name).digest('hex').slice(0, 7);

      name = name.slice(0, maxLength).replace(/_+$/g, ''); // trim any `_` suffix
      name = `${name}_${hash}`;
    }
    return name;
  }

  private sitesInfo(option: LH_OptionType) {
    let sites: string[] = [];
    //same origins files should be serialized in same files;
    const sameOrigins: Record<string, boolean> = {};

    if ('urls' in option) {
      sites = Array.isArray(option.urls) ? option.urls : [option.urls];
    }

    return sites.reduce<{ url: string; origin: string; fileName: string }[]>(
      (sites, url, index) => {
        const origin = this.getOrigin(url);
        let fileName = origin;
        while (sameOrigins[origin] === true) {
          fileName = `${fileName}_${index}`;
        }
        sameOrigins[origin] = true;

        return [
          ...sites,
          {
            url,
            origin,
            fileName,
          },
        ];
      },
      []
    );
  }
}
