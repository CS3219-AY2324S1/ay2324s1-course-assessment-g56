'use client';

import {
  FormControl,
  FormLabel,
  Select,
  Flex,
  Button,
  Box,
} from '@chakra-ui/react';
import Difficulty from '@/constants/difficulty';
import { REQ_FIND_PAIR, RES_FIND_PAIR } from '@/constants/socket';
import { useState } from 'react';
import io from 'socket.io-client';
import * as dotenv from 'dotenv';

dotenv.config();

// Listen for 'message' event from the server
const socket = io(process.env.MATCHING_PORT || 'http://localhost:6006');

export default function Page() {
  const placeholder = 'Choose difficulty';

  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);

  const changeDifficulty = (e) =>
    setDifficulty(Difficulty[e.target.value as keyof typeof Difficulty]);

  const sendMessage = () => {
    socket.emit(REQ_FIND_PAIR, difficulty);

    socket.on(RES_FIND_PAIR, () => {
      console.log('Working hard to find a match for you...');
    });
  };

  return (
    <Flex direction="column" align="center" justify="center">
      <Box bg="white" p={5} borderRadius="md" boxShadow="lg">
        <FormControl id="difficulty" isRequired>
          <FormLabel textAlign="center">Matching Difficulty</FormLabel>
          <Select
            textAlign="center"
            onChange={changeDifficulty}
            required
            maxW="300px"
            m="auto"
          >
            <option value={placeholder} disabled>
              {placeholder}
            </option>
            <option value={Difficulty.EASY}>Easy</option>
            <option value={Difficulty.MEDIUM}>Medium</option>
            <option value={Difficulty.HARD}>Hard</option>
            <option value={Difficulty.ANY}>Any</option>
          </Select>
        </FormControl>
        <br />
        <Flex width="100%" justify="center">
          <Button onClick={sendMessage} colorScheme="teal" size="md">
            Send
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
}
