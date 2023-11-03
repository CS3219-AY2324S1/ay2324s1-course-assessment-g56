'use client';

import {
  FormControl,
  FormLabel,
  Input,
  Select as ChakraSelect,
  VStack,
} from '@chakra-ui/react';
import { QuestionDifficulty, questionCategories } from '@/types/question';
import { ChangeEvent, MutableRefObject } from 'react';
import { Select } from 'chakra-react-select';

interface AddQuestionFormProps {
  changeTitle: (e: ChangeEvent<HTMLInputElement>) => void;
  changeDescription: (e: ChangeEvent<HTMLInputElement>) => void;
  changeCategories: (newValue) => void;
  changeDifficulty: (e: ChangeEvent<HTMLSelectElement>) => void;
  changeLink: (e: ChangeEvent<HTMLInputElement>) => void;
  initialRef: MutableRefObject<null>;
}

interface CategoryOption {
  label: string;
  value: string;
}

const categoryOptions: CategoryOption[] = questionCategories.map(
  (category) => ({
    label: category,
    value: category,
  }),
);

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
        <Select
          isMulti
          name="categories"
          colorScheme="blue"
          options={categoryOptions}
          placeholder="Select categories"
          closeMenuOnSelect={false}
          onChange={changeCategories}
        />
      </FormControl>

      <FormControl id="difficulty" isRequired>
        <FormLabel>Difficulty</FormLabel>
        <ChakraSelect onChange={changeDifficulty} required>
          <option value={placeholder} disabled>
            {placeholder}
          </option>
          <option value={QuestionDifficulty.EASY}>Easy</option>
          <option value={QuestionDifficulty.MEDIUM}>Medium</option>
          <option value={QuestionDifficulty.HARD}>Hard</option>
        </ChakraSelect>
      </FormControl>

      <FormControl id="link" isRequired>
        <FormLabel>Link</FormLabel>
        <Input type="text" placeholder="Enter link" onChange={changeLink} />
      </FormControl>
    </VStack>
  );
}

export default AddQuestionForm;
