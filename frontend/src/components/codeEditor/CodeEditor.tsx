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
} from '@chakra-ui/react';
import { Compartment, EditorState } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView, keymap } from '@codemirror/view';
import { yCollab } from 'y-codemirror.next';
import { Doc } from 'yjs';
import axios from 'axios';

import { Language } from '@/types/language';

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

// setting wait to true does not scale well
// but i m too lazy to write the polling code
const tokenUrl = `${process.env.CODE_EXECUTION_PATH}/submissions?base64_encoded=false&wait=true}`;

const resultUrl = (token) =>
  `${process.env.CODE_EXECUTION_PATH}/submissions/${token}?base64_encoded=false`;

const MAX_ATTEMPTS = 10; // Maximum number of polling attempts
const POLLING_INTERVAL = 2000; // Delay between polling attempts in milliseconds

const getSubmissionResult = async (token, attempts = 0) => {
  try {
    const response = await axios.get(resultUrl(token));
    const statusId = response.data.status.id;

    if (!(statusId === 1 || statusId === 2)) {
      return response.data;
    }
    if (attempts < MAX_ATTEMPTS) {
      // If the submission is still being processed, wait and then retry
      await new Promise((resolve) => {
        setTimeout(resolve, POLLING_INTERVAL);
      });
      return getSubmissionResult(token, attempts + 1);
    }
    return 'Time Limit Exceeded';
  } catch (error) {
    console.error('Error fetching result:', error);
    throw error;
  }
};

function formatJudge0Message(result) {
  let message = '';

  // Check if there's a compile error
  if (result.compile_output) {
    message += `Compile Error:\n${result.compile_output}\n`;
  }

  // Check if there's a runtime error
  if (result.stderr) {
    message += `Runtime Error:\n${result.stderr}\n`;
  }

  // Check if the code executed successfully but there's no output
  if (result.stdout === null && !result.stderr) {
    message += `No output\n`;
  }

  // If there's output, display it
  if (result.stdout) {
    message += `Output:\n${result.stdout}\n`;
  }

  // Add time and memory usage
  message += `Time: ${result.time} seconds\n`;
  message += `Memory: ${result.memory} KB\n`;

  // Add status message
  if (result.status && result.status.description) {
    message += `Status: ${result.status.description}\n`;
  }

  // Add any additional message
  if (result.message) {
    message += `Message: ${result.message}\n`;
  }

  return message.trim();
}

function getLanguageId(language: Language) {
  switch (language) {
    case Language.PYTHON:
      return 71;
    case Language.JAVASCRIPT:
      return 63;
    case Language.JAVA:
      return 62;
    default:
      return 71;
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
  const [provider, setProvider] = useState<WebrtcProvider>();
  const [ydoc, setYdoc] = useState<Doc>();
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
    language,
  );
  const [codeResult, setCodeResult] = useState('No code result yet');
  const [isRunningCode, setIsRunningCode] = useState(false);
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

    newProvider.awareness.setLocalStateField('user', {
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

    newProvider.on('synced', (synced) => {
      // NOTE: This is only called when a different browser connects to this client
      // Windows of the same browser communicate directly with each other
      // Although this behavior might be subject to change.
      // It is better not to expect a synced event when using y-webrtc
      console.log('synced!', synced);
    });

    return (): void => {
      view?.destroy();
      newProvider.disconnect();
      newYdoc.destroy();
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
      // close room
      view?.destroy();
      provider.disconnect();
      ydoc.destroy();
    }
  }, [isRoomOpen, view]);

  return (
    <Flex direction="column" height="100%" width="100%">
      <Box width="max-content">
        <HStack>
          <Select value={selectedLanguage} onChange={handleLanguageChange}>
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
