'use client';

import {
  Text,
  Button,
  Box,
  useColorModeValue,
  Center,
  VStack,
  useToast,
  Alert,
  AlertIcon,
  useDisclosure,
  CloseButton,
} from '@chakra-ui/react';
import { QuestionComplexity } from '@/types/question';
import {
  DISCONNECT,
  REQ_FIND_PAIR,
  RES_CANNOT_FIND_PAIR,
  RES_FOUND_PAIR,
  ERROR_FIND_PAIR,
  REQ_STOP_FINDING_PAIR,
  RES_STOP_FINDING_PAIR,
  RES_FIND_PAIR,
} from '@/constants/socket';
import { useState } from 'react';
import { useSession } from '@/contexts/SupabaseProvider';

import 'dotenv/config';
import { BasicProfileData } from '@/types/profile';
import QuestionRangeSlider from '@/components/slider/QuestionRangeSlider';
import useTimer from '@/hooks/useTimer';
import useSocket from '@/hooks/useSocket';
import MatchFoundModal from '@/components/modal/MatchFoundModal';

function Page() {
  const [lowerBoundDifficulty, setLowerBoundDifficulty] =
    useState<QuestionComplexity>(QuestionComplexity.EASY);

  const [upperBoundDifficulty, setUpperBoundDifficulty] =
    useState<QuestionComplexity>(QuestionComplexity.HARD);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [matchedUser, setMatchedUser] = useState<BasicProfileData | null>(null);
  const [roomId, setRoomId] = useState('');
  const [difficulty, setDifficulty] = useState<QuestionComplexity | null>(null);

  const {
    isOpen: isDisconnectVisible,
    onClose: onDisconnectClose,
    onOpen: onDisconnectOpen,
  } = useDisclosure({ defaultIsOpen: true });

  const { isOpen: isMatchVisible, onOpen: onMatchOpen } = useDisclosure({
    defaultIsOpen: false,
  });

  const toast = useToast();
  const session = useSession();

  const { socket, isConnected } = useSocket(session);

  const { timer, startTimer, resetTimer } = useTimer();

  const doneMatching = () => {
    setIsSubmitting(false);
    setIsCancelling(false);
    resetTimer();
  };

  const requestMatch = () => {
    setIsSubmitting(true);
    socket.emit(REQ_FIND_PAIR, lowerBoundDifficulty, upperBoundDifficulty);

    socket.on(DISCONNECT, () => {
      onDisconnectOpen();
      doneMatching();
    });

    socket.on(RES_FIND_PAIR, () => {
      startTimer();
    });

    socket.on(RES_CANNOT_FIND_PAIR, () => {
      doneMatching();
      if (!toast.isActive(RES_CANNOT_FIND_PAIR)) {
        toast({
          id: RES_CANNOT_FIND_PAIR,
          title: 'No match found!',
          description:
            'Please try again later or loosen matching requirements.',
          status: 'error',
        });
      }
    });

    socket.on(ERROR_FIND_PAIR, (msg: string) => {
      doneMatching();
      if (!toast.isActive(ERROR_FIND_PAIR)) {
        toast({
          id: ERROR_FIND_PAIR,
          title: `${msg}`,
          status: 'error',
        });
      }
    });

    socket.on(
      RES_FOUND_PAIR,
      ({
        matchedUser: user,
        roomId: newRoomId,
        difficulty: newDifficulty,
      }: {
        matchedUser: BasicProfileData;
        roomId: string;
        difficulty: QuestionComplexity;
      }) => {
        doneMatching();
        setMatchedUser(user);
        setRoomId(newRoomId);
        setDifficulty(newDifficulty);
        onMatchOpen();
      },
    );
  };

  const cancelMatchRequest = () => {
    setIsCancelling(true);
    socket.emit(REQ_STOP_FINDING_PAIR);
    socket.on(DISCONNECT, () => {
      doneMatching();
      onDisconnectOpen();
    });

    socket.on(RES_STOP_FINDING_PAIR, () => {
      doneMatching();
    });
  };

  return (
    <Center>
      <Box
        bg={useColorModeValue('white', 'gray.900')}
        p={10}
        width={600}
        borderRadius="md"
        boxShadow="lg"
      >
        <VStack spacing={8} align="center">
          {isDisconnectVisible && !isConnected && (
            <Alert status="error">
              <AlertIcon />
              Disconnected from server.
              <CloseButton
                position="absolute"
                right={2}
                onClick={onDisconnectClose}
              />
            </Alert>
          )}
          <Text textAlign="center" fontSize="xl" fontWeight="bold">
            Choose Matching Difficulty
          </Text>
          <QuestionRangeSlider
            setLowerBoundDifficulty={setLowerBoundDifficulty}
            setUpperBoundDifficulty={setUpperBoundDifficulty}
          />
          <Button
            onClick={requestMatch}
            colorScheme="green"
            size="md"
            isLoading={isSubmitting}
            isDisabled={!isConnected}
            mt="40px"
            loadingText={`Finding a match... (${timer}s)`}
          >
            Find match
          </Button>
          {isSubmitting && (
            <Button
              onClick={cancelMatchRequest}
              size="md"
              isLoading={isCancelling}
              isDisabled={!isConnected || !isSubmitting}
              loadingText="Cancelling..."
            >
              Cancel
            </Button>
          )}
        </VStack>
        <MatchFoundModal
          isOpen={isMatchVisible}
          roomId={roomId}
          matchedUser={matchedUser}
          difficulty={difficulty}
        />
      </Box>
    </Center>
  );
}
export default Page;
