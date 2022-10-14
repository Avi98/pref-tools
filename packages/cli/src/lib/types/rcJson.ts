import { CollectOptionsType } from '../commands/collect/options/types/collectOptionType';
import {
  AssertOptionsType,
  UploadOptionsType,
} from '../commands/types/optionsType';

export type RcType = {
  collect: CollectOptionsType;
  upload: UploadOptionsType;
  assert: AssertOptionsType;
};
