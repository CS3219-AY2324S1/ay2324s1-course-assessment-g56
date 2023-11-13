import { useEffect, useState } from 'react';
import { HStack, Icon, Text, Textarea } from '@chakra-ui/react';
import { useDebounce } from '@/hooks/useDebounce';
import { UUID } from 'crypto';
import { useUpdateRoomNotesMutation } from '@/hooks/useUpdateRoomMutation';
import { BsCloudCheck } from 'react-icons/bs';
import { PiArrowsClockwiseLight } from 'react-icons/pi';

interface InterviewerNotesProps {
  roomId: UUID;
  user: 'user1' | 'user2';
}

function InterviewerNotes({ roomId, user }: InterviewerNotesProps) {
  const [interviewerNotes, setInterviewerNotes] = useState<string>('');
  const debouncedNotes = useDebounce(interviewerNotes, 1000);
  const updateRoomNotesMutation = useUpdateRoomNotesMutation(roomId);
  const saving =
    updateRoomNotesMutation.isPending || interviewerNotes !== debouncedNotes;

  useEffect(() => {
    updateRoomNotesMutation.mutate({ key: user, notes: debouncedNotes });
  }, [debouncedNotes]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (saving) {
        event.preventDefault();
        event.returnValue = true;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <>
      <HStack align="end" mb={1} mt={4}>
        <Icon
          as={saving ? PiArrowsClockwiseLight : BsCloudCheck}
          ml={1}
          mb="1px"
        />
        <Text fontSize="sm" color="gray.500">
          {saving ? 'Saving...' : 'Saved'}
        </Text>
      </HStack>
      <Textarea
        placeholder="Take interview notes here..."
        value={interviewerNotes}
        onChange={(e) => setInterviewerNotes(e.target.value)}
        h="calc(50vh - 25px)"
        maxH="calc(50vh - 25px)"
      />
    </>
  );
}

export default InterviewerNotes;
