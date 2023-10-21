import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorMode, Select, Flex, Box } from '@chakra-ui/react';
import { Compartment, EditorState } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView, keymap } from '@codemirror/view';
// import { Socket } from 'socket.io-client';
import { yCollab } from 'y-codemirror.next';
import { Doc } from 'yjs';
import { Language } from '@/types/code';

import { WebrtcProvider } from 'y-webrtc';
import { insertTab, indentLess } from '@codemirror/commands';

// import { CodeMirrorBinding } from 'y-codemirror';
// import { WebsocketProvider } from 'y-websocket';

import {
  CURSOR_COLOR_TO_SEND_PARTNER,
  ONE_DARK_BACKGROUND_COLOR,
} from './colors';
import getLanguageExtension from './languages';
// import { YjsProvider } from './YjsProvider';
import './CodeEditor.css';

interface Props {
  language: Language | null;
  username: string;
  // socket: Socket | null;
  roomSlug: string;
  width?: string;
  height?: string;
}

export default function CodeEditor({
  // socket,
  roomSlug,
  language,
  username,
}: Props): ReactElement<Props, 'div'> {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [element, setElement] = useState<HTMLElement>();
  const [view, setView] = useState<EditorView>();
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
    language,
  );
  const languageCompartment = useMemo(() => new Compartment(), []);

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedLanguage(event.target.value as Language);
  };

  const ref = useCallback((node: HTMLElement | null): void => {
    if (!node) {
      return;
    }

    setElement(node);
  }, []);

  useEffect(() => {
    if (!element) {
      return;
    }

    const ydoc = new Doc();
    const provider = new WebrtcProvider(roomSlug, ydoc);
    const yText = ydoc.getText(roomSlug);

    provider.awareness.setLocalStateField('user', {
      name: username,
      color: CURSOR_COLOR_TO_SEND_PARTNER.color,
      colorLight: CURSOR_COLOR_TO_SEND_PARTNER.light,
    });

    const view = new EditorView({
      state: EditorState.create({
        doc: yText.toString(),
        extensions: [
          languageCompartment.of(getLanguageExtension(language)),
          EditorView.lineWrapping,
          yCollab(yText, provider.awareness),
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
    });
    setView(view);

    return (): void => {
      view?.destroy();
      provider.disconnect();
      ydoc.destroy();
    };
    // }, [element, isDark, username, roomSlug, socket]);
  }, [element, isDark, username, roomSlug]);

  useEffect(() => {
    if (view && language && selectedLanguage) {
      view.dispatch({
        effects: languageCompartment.reconfigure(
          getLanguageExtension(selectedLanguage),
        ),
      });
    }
  }, [selectedLanguage, language, languageCompartment, view]);

  return (
    <Flex direction="column" padding={4} height="100%" width="100%">
      <Box width="max-content">
        <Select value={selectedLanguage} onChange={handleLanguageChange}>
          {Object.values(Language).map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </Select>
      </Box>
      <Box flex="1" minHeight="0">
        <div
          ref={ref}
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: isDark ? ONE_DARK_BACKGROUND_COLOR : 'snow',
          }}
        />
      </Box>
    </Flex>
  );
}
