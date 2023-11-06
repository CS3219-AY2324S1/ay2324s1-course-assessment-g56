'use client';

import { Avatar, Button, HStack, Text } from '@chakra-ui/react';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { BasicProfileData } from '@/types/profile';
import { QuestionDifficulty } from '@/types/question';
import Modal from './Modal';

interface MatchFoundModalProps {
  isOpen: boolean;
  roomId: string;
  matchedUser: BasicProfileData;
  difficulty: QuestionDifficulty;
}

function MatchFoundModal({
  isOpen,
  roomId,
  matchedUser,
  difficulty,
}: MatchFoundModalProps) {
  const modalTitle = 'Found a match for you!';
  const finalRef = useRef(null);
  const router = useRouter();

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}}
      title={modalTitle}
      finalRef={finalRef}
      isClosable={false}
      actions={
        <Button
          colorScheme="blue"
          onClick={() => {
            router.push(`/collabRoom/${roomId}`);
          }}
        >
          Go To Room
        </Button>
      }
    >
      <HStack spacing="4">
        <Text fontSize="lg">Your match is:</Text>
        <HStack>
          <Avatar
            src={matchedUser?.avatarUrl || ''}
            name={matchedUser?.username}
          />
          <Text fontSize="lg">{matchedUser?.username}</Text>
        </HStack>
      </HStack>
      <Text fontSize="lg" pb="3">
        Room ID: {roomId}
      </Text>
      <Text fontSize="lg">Difficulty: {difficulty}</Text>
    </Modal>
  );
}

export default MatchFoundModal;
