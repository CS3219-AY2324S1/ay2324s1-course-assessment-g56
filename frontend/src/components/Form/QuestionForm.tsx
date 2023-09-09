'use client';

import { useState } from 'react';
import { Question, QuestionComplexity } from '@/types/question';
import { Button, FormControl, FormLabel, Input, Select, VStack, Box, Heading} from '@chakra-ui/react';

const QuestionForm = ({addQuestion}) => {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [cat, setCat] = useState("");
    const placeholder = "Choose difficulty";
    const [complexity, setComplexity] = useState(placeholder);

    const isFormValid = title !== "" && desc !== "" && cat !== "" && complexity !== placeholder;

    const handleComplexityChange = (e) => {
        setComplexity(e.target.value as QuestionComplexity);
    }

    const handleSubmit = (event) => {
        event.preventDefault();  // Prevent the form from refreshing the page

        if (!isFormValid) {
            console.log("Form is not valid");
            return;
        }

        const newQuestion: Question = {
            questionTitle: title,
            questionDescription: desc,
            questionCategories: cat.split(',').map(item => item.trim()),
            questionComplexity: complexity
        };

        addQuestion(newQuestion);

        console.log("Question Added!");

        // Clear the form fields
        setTitle("");
        setDesc("");
        setCat("");
        setComplexity(placeholder);
        console.log(isFormValid);
    };

  return (
    <Box bg="white" p={5} boxShadow="md" borderRadius="md" width="300px" margin="0 auto">
      <Heading mb={4} size="lg">Add Question</Heading>
      <VStack spacing={4}>
        <FormControl id="title" isRequired>
          <FormLabel>Title</FormLabel>
          <Input 
            type="text" 
            placeholder="Enter title"
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormControl>

        <FormControl id="desc" isRequired>
          <FormLabel>Description</FormLabel>
          <Input 
            type="text"
            placeholder="Enter description"
            value={desc} 
            onChange={(e) => setDesc(e.target.value)}
          />
        </FormControl>

        <FormControl id="cat" isRequired>
          <FormLabel>Categories</FormLabel>
          <Input 
            type="text"
            placeholder="Enter categories (comma-separated)"
            value={cat} 
            onChange={(e) => setCat(e.target.value)}
          />
        </FormControl>

        <FormControl id="complexity" isRequired>
          <FormLabel>Difficulty</FormLabel>
          <Select 
              value={complexity} 
              onChange={handleComplexityChange}
              required>
              <option value={placeholder} disabled>{placeholder}</option>
              <option value={QuestionComplexity.EASY}>Easy</option>
              <option value={QuestionComplexity.MEDIUM}>Medium</option>
              <option value={QuestionComplexity.HARD}>Hard</option>
          </Select>
        </FormControl>

        <Button colorScheme="teal" type="submit" onClick={handleSubmit}>
          Submit
        </Button>
      </VStack>
    </Box>
  );
};

export default QuestionForm;