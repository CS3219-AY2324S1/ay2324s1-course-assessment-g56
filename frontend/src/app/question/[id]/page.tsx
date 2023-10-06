'use client';

import { getQuestionById } from '@/lib/questions';
import { Question } from '@/types/question';
import {
  Card,
  CardBody,
  Flex,
  HStack,
  Heading,
  IconButton,
  Tag,
  Text,
  VStack,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';

function Page({ params }: { params: { id: number } }) {
  const { id } = params;
  const [question, setQuestion] = useState<Question>();
  useEffect(() => {
    setQuestion(getQuestionById(id));
  }, []);
  if (!question) return null;
  return (
    <VStack>
      <Flex width="100%" height={54}>
        <Link href="/home">
          <IconButton
            aria-label="Back"
            icon={<FiArrowLeft />}
            as="a"
            height={54}
            width={54}
            fontSize={30}
            colorScheme="teal"
            position="absolute"
          />
        </Link>
        <Heading
          fontSize="3xl"
          fontWeight="bold"
          ml="50%"
          mt="7px"
          transform="translateX(-50%)"
        >
          {question.questionTitle}
        </Heading>
      </Flex>
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
