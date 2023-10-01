'use client';

import { getQuestionById } from '@/lib/questions';
import { Question } from '@/types/question';
import {
  Card,
  CardBody,
  Grid,
  HStack,
  Heading,
  IconButton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FiArrowLeft } from 'react-icons/fi';
import { useEffect, useState } from 'react';

// id is the UUID of question
function Page({ params }: { params: { uuid: string } }) {
  const [question, setQuestion] = useState<Question | null>(null);
  const { uuid } = params;
  useEffect(() => {
    getQuestionById(uuid)
      .then((fetchedQuestion: Question) => {
        setQuestion(fetchedQuestion);
      })
      .catch((error) => {
        console.error('Error fetching question:', error);
      });
  }, [uuid]);

  if (!question) {
    // Render loading or error message while waiting for the question to load
    return <div>Loading...</div>;
  }
  return (
    <VStack>
      <Grid templateColumns="repeat(3, 2fr)">
        <IconButton
          aria-label="Back"
          icon={<FiArrowLeft />}
          onClick={() => window.history.back()}
          height={54}
          width={54}
          fontSize={30}
          colorScheme="teal"
        />
        <Heading fontSize="3xl" fontWeight="bold">
          {question.title}
        </Heading>
      </Grid>
      <HStack>{question.category}</HStack>
      <Card>
        <CardBody>
          <Text>{question.description}</Text>
        </CardBody>
      </Card>
    </VStack>
  );
}

export default Page;
