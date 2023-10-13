import { Language } from '@/types/code';
import { java } from '@codemirror/lang-java';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';

export default function getLanguageExtension(language: Language | null) {
  switch (language) {
    case Language.JAVA:
      return java();
    case Language.PYTHON_THREE:
      return python();
    default:
      return javascript();
  }
}
