'use client';

import {
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
} from '@chakra-ui/react';
import { QuestionDifficulty } from '@/types/question';
import { ChangeEvent, MutableRefObject } from 'react';

interface AddQuestionFormProps {
  changeTitle: (e: ChangeEvent<HTMLInputElement>) => void;
  changeDescription: (e: ChangeEvent<HTMLInputElement>) => void;
  changeCategories: (e: ChangeEvent<HTMLInputElement>) => void;
  changeDifficulty: (e: ChangeEvent<HTMLSelectElement>) => void;
  changeLink: (e: ChangeEvent<HTMLInputElement>) => void;
  initialRef: MutableRefObject<null>;
}

function AddQuestionForm({
  initialRef,
  changeCategories,
  changeDifficulty,
  changeDescription,
  changeTitle,
  changeLink,
}: AddQuestionFormProps) {
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

      <FormControl id="difficulty" isRequired>
        <FormLabel>Difficulty</FormLabel>
        <Select onChange={changeDifficulty} required>
          <option value={placeholder} disabled>
            {placeholder}
          </option>
          <option value={QuestionDifficulty.EASY}>Easy</option>
          <option value={QuestionDifficulty.MEDIUM}>Medium</option>
          <option value={QuestionDifficulty.HARD}>Hard</option>
        </Select>
      </FormControl>

      <FormControl id="link" isRequired>
        <FormLabel>Link</FormLabel>
        <Input type="text" placeholder="Enter link" onChange={changeLink} />
      </FormControl>
    </VStack>
  );
}

export default AddQuestionForm;
