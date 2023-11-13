import { KeyBinding } from '../types/code';
import { Language } from '../types/language';

export const LANGUAGE_TO_STRING = Object.freeze({
  [Language.JAVA]: 'Java',
  [Language.PYTHON_THREE]: 'Python 3',
  [Language.JAVASCRIPT]: 'JavaScript',
});

export const KEY_BINDING_TO_STRING = Object.freeze({
  [KeyBinding.STANDARD]: 'Standard',
  [KeyBinding.VIM]: 'Vim',
  [KeyBinding.VS_CODE]: 'VSCode',
});
