'use client';

import {
  FormControl,
  FormLabel,
  Input,
  Select as ChakraSelect,
  VStack,
  useColorMode,
} from '@chakra-ui/react';
import {
  QuestionCategory,
  QuestionDifficulty,
  questionCategories,
} from '@/types/question';
import { ChangeEvent, MutableRefObject } from 'react';
import { Select } from 'chakra-react-select';
import MDEditor from '@uiw/react-md-editor';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

interface AddQuestionFormProps {
  categories: QuestionCategory[];
  description: string;
  changeTitle: (e: ChangeEvent<HTMLInputElement>) => void;
  changeDescription: (value: string) => void;
  changeCategories: (newValue) => void;
  changeDifficulty: (e: ChangeEvent<HTMLSelectElement>) => void;
  changeLink: (e: ChangeEvent<HTMLInputElement>) => void;
  initialRef: MutableRefObject<null>;
}

interface CategoryOption {
  label: QuestionCategory;
  value: QuestionCategory;
}

const categoryOptions: CategoryOption[] = questionCategories.map(
  (category) => ({
    label: category,
    value: category,
  }),
);

function AddQuestionForm({
  initialRef,
  categories,
  description,
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
        <MDEditor
          value={description}
          onChange={changeDescription}
          data-color-mode={useColorMode().colorMode}
          height={250}
          style={{ width: '100%' }}
          visibleDragbar={false}
          previewOptions={{
            remarkPlugins: [remarkGfm, remarkMath],
            // @ts-expect-error
            rehypePlugins: [rehypeKatex],
          }}
        />
      </FormControl>

      <FormControl id="cat" isRequired>
        <FormLabel>Categories</FormLabel>
        <Select
          isMulti
          instanceId={1}
          name="categories"
          colorScheme="blue"
          options={categoryOptions}
          placeholder="Select categories"
          isOptionDisabled={() => categories.length >= 6}
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
