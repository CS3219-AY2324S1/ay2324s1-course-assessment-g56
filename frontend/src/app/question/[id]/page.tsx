'use client';

import { getQuestionById } from '@/lib/questions';
import {
  Card,
  CardBody,
  Grid,
  HStack,
  Heading,
  IconButton,
  Tag,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FiArrowLeft } from 'react-icons/fi';

function Page({ params }: { params: { id: number } }) {
  const { id } = params;
  const question = getQuestionById(id);
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
          {question.questionTitle}
        </Heading>
      </Grid>
      <HStack>
        {question.questionCategories.map((category: string) => (
          <Tag key={category} colorScheme="whatsapp">
            {category}
          </Tag>
        ))}
      </HStack>
      <Card>
        <CardBody>
          <Text>{question.questionDescription}</Text>
        </CardBody>
      </Card>
    </VStack>
  );
}

export default Page;
