import { Language } from '@/types/code';
import { java } from '@codemirror/lang-java';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';

export const getLanguageExtension = (language: Language | null): Extension => {
  switch (language) {
    case Language.JAVA:
      return java();
    case Language.PYTHON_THREE:
      return python();
    case Language.JAVASCRIPT:
      return javascript();
  }
  return javascript();
};
