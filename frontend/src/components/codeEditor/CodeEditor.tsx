import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useContext,
} from 'react';
import { useColorMode, Select, Flex, Box, Skeleton } from '@chakra-ui/react';
import { Compartment, EditorState } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView, keymap } from '@codemirror/view';
import { yCollab } from 'y-codemirror.next';
import { Doc } from 'yjs';
import { Language } from '@/types/code';

import { WebrtcProvider } from 'y-webrtc';
import { insertTab, indentLess } from '@codemirror/commands';

import {
  CURSOR_COLOR_TO_SEND_PARTNER,
  ONE_DARK_BACKGROUND_COLOR,
} from './colors';
import getLanguageExtension from './languages';
import { RoomContext } from '../collabRoom/RoomContext';

import './CodeEditor.css';

interface Props {
  language: Language | null;
  username: string;
  roomSlug: string;
  isUser1: boolean;
  // isRoomOpen: boolean;
  // setState: (state: EditorState) => void;
}

function formatLanguage(language: Language) {
  switch (language) {
    case Language.PYTHON_THREE:
      return 'Python 3';
    case Language.JAVASCRIPT:
      return 'JavaScript';
    case Language.JAVA:
      return 'Java';
    default:
      return language;
  }
}

export default function CodeEditor({
  roomSlug,
  language,
  username,
  isUser1, // isRoomOpen,
} // setState,
: Props): ReactElement<Props, 'div'> {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [element, setElement] = useState<HTMLElement>();
  const [view, setView] = useState<EditorView>();
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
    language,
  );
  const languageCompartment = useMemo(() => new Compartment(), []);

  const {
    isRoomOpen,
    // setIsRoomOpen,
    // room1State,
    setRoom1State,
    // room2State,
    setRoom2State,
  } = useContext(RoomContext);

  const setState = isUser1 ? setRoom1State : setRoom2State;

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedLanguage(event.target.value as Language);
  };
  // Toggles between read only and editable
  // let readOnly = false;

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
    // Best to launch our own signaling server
    const provider = new WebrtcProvider(roomSlug, ydoc, {
      signaling: [
        // Local
        'ws://localhost:8080',
        // Public
        // 'wss://signaling.yjs.dev',
        // 'wss://y-webrtc-signaling-eu.herokuapp.com',
        // 'wss://y-webrtc-signaling-us.herokuapp.com',
      ],
    });
    const yText = ydoc.getText(roomSlug);

    provider.awareness.setLocalStateField('user', {
      name: username,
      color: CURSOR_COLOR_TO_SEND_PARTNER.color,
      colorLight: CURSOR_COLOR_TO_SEND_PARTNER.light,
    });

    setView(
      new EditorView({
        state: EditorState.create({
          doc: yText.toString(),
          extensions: [
            languageCompartment.of(getLanguageExtension(language)),
            EditorView.lineWrapping,
            // EditorState.readOnly.of(readOnly),
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
      }),
    );

    provider.on('synced', (synced) => {
      // NOTE: This is only called when a different browser connects to this client
      // Windows of the same browser communicate directly with each other
      // Although this behavior might be subject to change.
      // It is better not to expect a synced event when using y-webrtc
      console.log('synced!', synced);
    });

    return (): void => {
      view?.destroy();
      provider.disconnect();
      ydoc.destroy();
    };
  }, [element]);

  useEffect(() => {
    if (view && language && selectedLanguage) {
      view.dispatch({
        effects: languageCompartment.reconfigure(
          getLanguageExtension(selectedLanguage),
        ),
      });
    }
  }, [selectedLanguage, language, languageCompartment, view]);

  // Exports state when room is closed
  useEffect(() => {
    if (!isRoomOpen && view) {
      // Set readonly to true
      // readOnly = true;
      // Progapage the export state to the close button
      setState(view.state.toJSON());
    }
  }, [isRoomOpen, view]);

  return (
    <Flex direction="column" padding={4} height="100%" width="100%">
      <Box width="max-content">
        <Select value={selectedLanguage} onChange={handleLanguageChange}>
          {Object.values(Language).map((lang) => (
            <option key={lang} value={lang}>
              {formatLanguage(lang)}
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
        {/* Conditionally render a skeleton while the editor is loading */}
        {!view && (
          <Skeleton
            position="absolute"
            top="0"
            left="0"
            height="100%"
            width="100%"
            zIndex="1"
          />
        )}
      </Box>
    </Flex>
  );
}
