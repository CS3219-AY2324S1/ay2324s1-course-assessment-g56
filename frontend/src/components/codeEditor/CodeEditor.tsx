import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useContext,
} from 'react';
import {
  useColorMode,
  Select,
  Flex,
  Box,
  Button,
  Textarea,
  HStack,
  Heading,
} from '@chakra-ui/react';
import { Compartment, EditorState } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView, keymap } from '@codemirror/view';
import { yCollab } from 'y-codemirror.next';
import { Doc } from 'yjs';
import axios from 'axios';

import { Language } from '@/types/language';

import { WebrtcProvider } from 'y-webrtc';
import { IndexeddbPersistence } from 'y-indexeddb';
import { useRoomStore } from '@/hooks/useRoomStore';
import { insertTab, indentLess } from '@codemirror/commands';

import { useQueryClient } from '@tanstack/react-query';
import { ROOM_QUERY_KEY } from '@/constants/queryKey';
import { BasicRoomData } from '@/types/collab';
import { useRoomData } from '@/hooks/useRoomData';
import { UUID } from 'crypto';
import NextLink from 'next/link';

import {
  CURSOR_COLOR_TO_SEND_PARTNER,
  ONE_DARK_BACKGROUND_COLOR,
} from './colors';
import getLanguageExtension from './languages';
import { RoomContext } from '../collabRoom/RoomContext';

import './CodeEditor.css';
import {
  getLanguageId,
  formatJudge0Message,
  getSubmissionResult,
  tokenUrl,
  // resultUrl
} from './CodeResultFunctions';
import { supabaseAnon } from '../supabase/supabase';

interface Props {
  roomId: UUID;
  language: Language | null;
  username: string;
  roomSlug: string;
  questionSlug: string;
  isUser1: boolean;
}

export default function CodeEditor({
  roomId,
  roomSlug,
  language,
  username,
  questionSlug,
  isUser1,
}: Props): ReactElement<Props, 'div'> {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [element, setElement] = useState<HTMLElement>();
  const [view, setView] = useState<EditorView>();
  const [provider, setProvider] = useState<WebrtcProvider>();
  const [ydoc, setYdoc] = useState<Doc>();

  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
    language,
  );
  const [codeResult, setCodeResult] = useState('No code result yet');
  const [isClosed, setIsClosed] = useState(false);
  const [isRunningCode, setIsRunningCode] = useState(false);
  const languageCompartment = useMemo(() => new Compartment(), []);

  const { setRoom1State, setRoom2State } = useContext(RoomContext);
  const { data: roomData } = useRoomData(roomId);

  const userQuestionSlug = useRoomStore((state) => state.questionSlug);
  const queryClient = useQueryClient();
  const isRoom1 = roomData?.user1Details.username === username;
  const userIsInterviewer = useRoomStore((state) => state.userIsInterviewer);

  const setState = isRoom1 ? setRoom1State : setRoom2State;
  const userKey = isRoom1 ? 'user1' : 'user2';

  // Listen to database changes
  const supabase = supabaseAnon;

  // Initialize state from supabse
  useEffect(() => {
    supabase
      .from('collaborations')
      .select('*')
      .eq('room_id', roomId)
      .then((res) => {
        setCodeResult(formatJudge0Message(res.data[0][`${userKey}_result`]));
        setSelectedLanguage(res.data[0][`${userKey}_language`]);
        setIsClosed(res.data[0].is_closed);
      });
  }, []);

  supabase
    .channel(roomId)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'collaborations',
        filter: `room_id=eq.${roomId}`,
      },
      (payload) => {
        const userResult = payload.new[`${userKey}_result`];
        const userLanguage = payload.new[`${userKey}_language`];
        const roomIsClosed = payload.new.is_closed;

        console.log('PAYLOAD: ', payload.new);

        // Check if the state is different before updating
        if (formatJudge0Message(userResult) !== codeResult) {
          setCodeResult(formatJudge0Message(userResult));
        }

        if (userIsInterviewer && userLanguage !== selectedLanguage) {
          setSelectedLanguage(userLanguage);
        }

        if (roomIsClosed !== isClosed) {
          setIsClosed(roomIsClosed);
        }
      },
    )
    .subscribe();

  const updateCodeResult = async (res: JSON) => {
    // export to supabase
    const { error } = await supabase
      .from('collaborations')
      .update({
        [`${userKey}_result`]: res,
      })
      .eq('room_id', roomId);

    if (error) {
      console.error('Error updating database:', error);
    }
  };

  const updateSelectedLanguage = async () => {
    // export to supabase
    const { error } = await supabase
      .from('collaborations')
      .update({
        [`${userKey}_language`]: selectedLanguage,
      })
      .eq('room_id', roomId);

    if (error) {
      console.error('Error updating database:', error);
    }
  };

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedLanguage(event.target.value as Language);
  };

  // Evaluate the code
  const runCode = async () => {
    if (view) {
      const code = view.state.doc.toString();
      setIsRunningCode(true);
      try {
        // Replace with your actual API call
        const data = {
          source_code: code,
          language_id: getLanguageId(selectedLanguage),
          stdin: 'world',
        };

        const { token } = (await axios.post(tokenUrl, data)).data;

        const output = await getSubmissionResult(token);
        setCodeResult(formatJudge0Message(output));
        updateCodeResult(output);
      } catch (error) {
        console.error('Error running code:', error);
        if (error.response) {
          console.error(error.response.data);
          console.error(error.response.status);
          console.error(error.response.headers);
        } else if (error.request) {
          console.error(error.request);
        } else {
          console.error('Error', error.message);
        }
      }
      setIsRunningCode(false);
    }
  };

  useEffect(() => {
    if (selectedLanguage) {
      updateSelectedLanguage();
    }
  }, [selectedLanguage]);

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
    const newYdoc = new Doc();
    const persistence = new IndexeddbPersistence(roomSlug, newYdoc);
    const newProvider = new WebrtcProvider(roomSlug, newYdoc, {
      signaling: [
        // Local
        process.env.SIGNALING_PATH,
        // Public
        // 'wss://signaling.yjs.dev',
        // 'wss://y-webrtc-signaling-eu.herokuapp.com',
        // 'wss://y-webrtc-signaling-us.herokuapp.com',
      ],
    });

    const yText = newYdoc.getText(roomSlug);

    persistence.once('synced', () => {
      setView(
        new EditorView({
          state: EditorState.create({
            doc: yText.toString(),
            extensions: [
              languageCompartment.of(getLanguageExtension(language)),
              EditorView.lineWrapping,
              // EditorState.readOnly.of(readOnly),
              yCollab(yText, newProvider.awareness),
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

      setProvider(newProvider);
      setYdoc(newYdoc);
    });

    newProvider.awareness.setLocalStateField('user', {
      name: username,
      color: CURSOR_COLOR_TO_SEND_PARTNER.color,
      colorLight: CURSOR_COLOR_TO_SEND_PARTNER.light,
      questionSlug,
    });

    newProvider.on('synced', (synced) => {
      // NOTE: This is only called when a different browser connects to this client
      // Windows of the same browser communicate directly with each other
      // Although this behavior might be subject to change.
      // It is better not to expect a synced event when using y-webrtc
      console.log('synced!', synced);
    });

    newProvider.awareness.on('change', (change) => {
      if (!isUser1) {
        return;
      }
      const { updated } = change;
      if (!updated) {
        return;
      }
      const user = newProvider.awareness.getStates().get(updated[0])?.user;
      if (!user) {
        return;
      }
      if (user.questionSlug !== userQuestionSlug) {
        const questionSlugKey = isRoom1
          ? 'user1QuestionSlug'
          : 'user2QuestionSlug';
        queryClient.setQueryData(
          [ROOM_QUERY_KEY],
          (oldData: BasicRoomData) => ({
            ...oldData,
            [questionSlugKey]: user.questionSlug,
          }),
        );
      }
    });

    return (): void => {
      view?.destroy();
      newProvider.disconnect();
      newYdoc.destroy();
    };
  }, [element]);

  useEffect(() => {
    if (!isUser1 && provider && userQuestionSlug) {
      provider.awareness.setLocalStateField('user', {
        name: username,
        color: CURSOR_COLOR_TO_SEND_PARTNER.color,
        colorLight: CURSOR_COLOR_TO_SEND_PARTNER.light,
        questionSlug: userQuestionSlug,
      });
    }
  }, [userQuestionSlug, provider, isUser1, username]);

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
    if (isClosed && view) {
      // Set readonly to true
      // readOnly = true;
      // Progapage the export state to the close button
      setState(view.state.toJSON());
      // close room
      view?.destroy();
      provider.disconnect();
      ydoc.destroy();
    }
  }, [isClosed, view]);

  if (isClosed) {
    return (
      <Box textAlign="center" p={5}>
        <Heading mb={4}>Room Closed</Heading>
        <Button as={NextLink} href="/" colorScheme="green" variant="outline">
          Go to home page
        </Button>
      </Box>
    );
  }
  return (
    <Flex direction="column" height="100%" width="100%">
      <Box width="max-content">
        <HStack>
          <Select
            value={selectedLanguage}
            onChange={handleLanguageChange}
            disabled={userIsInterviewer}
          >
            {Object.values(Language).map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </Select>

          <Button
            colorScheme="blue"
            onClick={runCode}
            isLoading={isRunningCode}
            loadingText="Running"
            disabled={!selectedLanguage}
          >
            Run Code
          </Button>
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
