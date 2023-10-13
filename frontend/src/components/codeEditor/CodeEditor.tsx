import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { useColorMode } from '@chakra-ui/react';
import { Compartment, EditorState } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView } from '@codemirror/view';
import { Socket } from 'socket.io-client';
import { yCollab } from 'y-codemirror.next';
import { Doc } from 'yjs';
import { Language } from '@/types/code';

import {
  CURSOR_COLOR_TO_SEND_PARTNER,
  ONE_DARK_BACKGROUND_COLOR,
} from './colors';
import getLanguageExtension from './languages';
import { YjsProvider } from './YjsProvider';
import './CodeEditor.css';

interface Props {
  language: Language | null;
  username: string;
  socket: Socket;
  roomSlug: string;
  width?: string;
  height?: string;
}

export default function CodeEditor({
  height,
  width,
  socket,
  roomSlug,
  language,
  username,
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
      return;
    }

    const yDoc = new Doc();
    const provider = new YjsProvider(socket, yDoc);
    const yText = yDoc.getText(roomSlug);

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
        ],
      }),
      parent: element,
    });
    setView(view);

    return (): void => {
      view?.destroy();
      provider.disconnect();
      yDoc.destroy();
    };
  }, [element, isDark, username, roomSlug, socket]);

  useEffect(() => {
    if (view && language) {
      view.dispatch({
        effects: languageCompartment.reconfigure(
          getLanguageExtension(language),
        ),
      });
    }
  }, [language, languageCompartment, view]);

  return (
    <div
      ref={ref}
      style={{
        height,
        width,
        backgroundColor: isDark ? ONE_DARK_BACKGROUND_COLOR : 'snow',
      }}
    />
  );
}
