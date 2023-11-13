import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  useColorMode,
  Select,
  Flex,
  Box,
  Textarea,
  HStack,
} from '@chakra-ui/react';
import { Compartment, EditorState } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView, keymap } from '@codemirror/view';

import { Language } from '@/types/language';

import { insertTab, indentLess } from '@codemirror/commands';

import { ONE_DARK_BACKGROUND_COLOR } from './colors';
import getLanguageExtension from './languages';

import './CodeEditor.css';

interface Props {
  selectedLanguage: Language;
  codeResult: string;
  userCode: string;
}

export default function CodeViewer({
  selectedLanguage,
  codeResult,
  userCode,
}: Props): ReactElement<Props, 'div'> {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [element, setElement] = useState<HTMLElement>();
  const [view, setView] = useState<EditorView>();

  const languageCompartment = useMemo(() => new Compartment(), []);

  const ref = useCallback((node: HTMLElement | null): void => {
    if (!node) {
      return;
    }

    setElement(node);
  }, []);

  useEffect(() => {
    if (!element) {
      return undefined;
    }

    setView(
      new EditorView({
        state: EditorState.create({
          doc: userCode,
          extensions: [
            languageCompartment.of(getLanguageExtension(selectedLanguage)),
            EditorView.lineWrapping,
            EditorState.readOnly.of(true),
            // yCollab(yText, newProvider.awareness),
            ...(isDark ? [oneDark] : []),
            EditorView.theme({}, { dark: isDark }),
            keymap.of([
              {
                key: 'Tab',
                preventDefault: true,
                run: insertTab,
              },
              {
                key: 'Shift-Tab',
                preventDefault: true,
                run: indentLess,
              },
            ]),
          ],
        }),
        parent: element,
      }),
    );

    return (): void => {
      view?.destroy();
    };
  }, [element]);

  return (
    <Flex direction="column" height="100%" width="100%">
      <Box width="max-content">
        <HStack>
          <Select value={selectedLanguage} disabled>
            {Object.values(Language).map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </Select>
        </HStack>
      </Box>

      <Box flex="1" minHeight="0" mt={2}>
        <HStack height="100%">
          <div
            ref={ref}
            style={{
              height: '100%',
              width: '100%',
              backgroundColor: isDark ? ONE_DARK_BACKGROUND_COLOR : 'snow',
            }}
          />

          <Textarea
            value={codeResult}
            placeholder="Results will be shown here..."
            readOnly
            variant="filled"
            height="100%"
          />
        </HStack>
      </Box>
    </Flex>
  );
}
