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
} from '@/constants/socket';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import QuestionRangeSlider from '../../components/slider/QuestionRangeSlider';

const socket = io(process.env.FRONTEND_SERVICE, {
  path: process.env.MATCHING_PATH,
  autoConnect: false,
});

function Page() {
  const [lowerBoundDifficulty, setLowerBoundDifficulty] =
    useState<QuestionComplexity>(QuestionComplexity.EASY);

  const [upperBoundDifficulty, setUpperBoundDifficulty] =
    useState<QuestionComplexity>(QuestionComplexity.HARD);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const {
    isOpen: isVisible,
    onClose,
    onOpen,
  } = useDisclosure({ defaultIsOpen: true });

  const toast = useToast();

  useEffect(() => {
    // Listen for 'message' event from the server
    
    const onConnect = () => {
      setIsConnected(true);
    };

    socket.on('connect', onConnect);
    console.log("betweeen");
    socket.connect();

    return (): void => {
      socket.off('connect', onConnect);
    };
  }, []);

  const sendMessage = () => {
    setIsSubmitting(true);
    socket.emit(REQ_FIND_PAIR, lowerBoundDifficulty, upperBoundDifficulty);

    socket.on(DISCONNECT, () => {
      setIsSubmitting(false);
      setIsConnected(false);
      onOpen();
    });

    socket.on(RES_CANNOT_FIND_PAIR, () => {
      setIsSubmitting(false);
      if (!toast.isActive('cannot-find-pair')) {
        toast({
          id: 'cannot-find-pair',
          title: 'Cannot find a match for you.',
          description: 'Please try again later.',
          status: 'error',
        });
      }
    });

    socket.on(RES_FOUND_PAIR, () => {
      setIsSubmitting(false);
      if (!toast.isActive('found-pair')) {
        toast({
          id: 'found-pair',
          title: 'Found a match for you!',
          description: 'Please wait while we redirect you to the room.',
          status: 'success',
        });
      }
    });
  };

  return (
    <Center>
      <Box
        bg={useColorModeValue('white', 'gray.800')}
        p={10}
        width={600}
        borderRadius="md"
        boxShadow="lg"
      >
        <VStack spacing={8} align="center">
          {isVisible && !isConnected && (
            <Alert status="error">
              <AlertIcon />
              Disconnected from server.
              <CloseButton position="absolute" right={2} onClick={onClose} />
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
            onClick={sendMessage}
            colorScheme="green"
            size="md"
            isLoading={isSubmitting}
            isDisabled={!isConnected}
            mt="40px"
            loadingText="Finding a match..."
          >
            Find match
          </Button>
        </VStack>
      </Box>
    </Center>
  );
}
export default Page;
