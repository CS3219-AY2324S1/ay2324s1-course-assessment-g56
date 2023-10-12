'use client';

import {
  Text,
  Button,
  Box,
  useColorModeValue,
  Center,
  VStack,
} from '@chakra-ui/react';
import { QuestionComplexity } from '@/types/question';
import {
  DISCONNECT,
  REQ_FIND_PAIR,
  RES_CANNOT_FIND_PAIR,
  RES_FIND_PAIR,
  RES_FOUND_PAIR,
} from '@/constants/socket';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import 'dotenv/config';
import QuestionRangeSlider from '../../components/slider/QuestionRangeSlider';

const socket = io(process.env.MATCHING_PORT || 'http://localhost:6006', {
  autoConnect: false,
});

function Page() {
  const [lowerBoundDifficulty, setLowerBoundDifficulty] =
    useState<QuestionComplexity>(QuestionComplexity.EASY);

  const [upperBoundDifficulty, setUpperBoundDifficulty] =
    useState<QuestionComplexity>(QuestionComplexity.HARD);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Listen for 'message' event from the server
    const onConnect = () => {
      // console.log('Connected to server.');
      setIsConnected(true);
    };

    socket.on('connect', onConnect);

    socket.connect();

    return (): void => {
      socket.off('connect', onConnect);
    };
  }, []);

  const sendMessage = () => {
    setIsSubmitting(true);
    socket.emit(REQ_FIND_PAIR, lowerBoundDifficulty, upperBoundDifficulty);

    socket.on(RES_FIND_PAIR, () => {
      // console.log('Working hard to find a match for you...');
    });

    socket.on(DISCONNECT, () => {
      setIsSubmitting(false);
      // console.log('Disconnected from server.');
    });

    socket.on(RES_CANNOT_FIND_PAIR, () => {
      setIsSubmitting(false);
      // console.log('Cannot find a match for you.');
    });

    socket.on(RES_FOUND_PAIR, () => {
      setIsSubmitting(false);
      // console.log('Found a match for you!');
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
