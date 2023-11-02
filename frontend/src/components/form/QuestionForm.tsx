'use client';

import {
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
} from '@chakra-ui/react';
import { QuestionComplexity } from '@/types/question';
import { ChangeEvent, MutableRefObject } from 'react';

interface QuestionFormProps {
  changeTitle: (e: ChangeEvent<HTMLInputElement>) => void;
  changeDescription: (e: ChangeEvent<HTMLInputElement>) => void;
  changeCategories: (e: ChangeEvent<HTMLInputElement>) => void;
  changeComplexity: (e: ChangeEvent<HTMLSelectElement>) => void;
  changeLink: (e: ChangeEvent<HTMLInputElement>) => void;
  initialRef: MutableRefObject<null>;
}

function QuestionForm({
  initialRef,
  changeCategories,
  changeComplexity,
  changeDescription,
  changeTitle,
  changeLink,
}: QuestionFormProps) {
  const placeholder = 'Choose difficulty';

  return (
    <VStack spacing={4}>
      <FormControl id="title" isRequired>
        <FormLabel>Title</FormLabel>
        <Input
          type="text"
          placeholder="Enter title"
          ref={initialRef}
          onChange={changeTitle}
        />
      </FormControl>

      <FormControl id="desc" isRequired>
        <FormLabel>Description</FormLabel>
        <Input
          type="text"
          placeholder="Enter description"
          onChange={changeDescription}
        />
      </FormControl>

      <FormControl id="cat" isRequired>
        <FormLabel>Categories</FormLabel>
        <Input
          type="text"
          placeholder="Enter categories (comma-separated)"
          onChange={changeCategories}
        />
      </FormControl>

      <FormControl id="complexity" isRequired>
        <FormLabel>Difficulty</FormLabel>
        <Select onChange={changeComplexity} required>
          <option value={placeholder} disabled>
            {placeholder}
          </option>
          <option value={QuestionComplexity.EASY}>Easy</option>
          <option value={QuestionComplexity.MEDIUM}>Medium</option>
          <option value={QuestionComplexity.HARD}>Hard</option>
        </Select>
      </FormControl>

      <FormControl id="link" isRequired>
        <FormLabel>Link</FormLabel>
        <Input type="text" placeholder="Enter link" onChange={changeLink} />
      </FormControl>
    </VStack>
  );
}

export default QuestionForm;
