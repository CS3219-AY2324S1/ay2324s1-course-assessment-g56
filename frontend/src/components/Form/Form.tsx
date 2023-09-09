'use client';

import { useState } from 'react';
import { Flex, Box } from "@chakra-ui/react";
import QuestionForm from "./QuestionForm";
import QuestionTable from "./QuestionTable";

const Form = () => {
    const [questions, setQuestions] = useState([]);

    const addQuestion = (newQuestion) => {
      // Assigning a new unique ID
      newQuestion.questionId = questions.length + 1;

      setQuestions(prevQuestions => [...prevQuestions, newQuestion]);
    };

    return (
        <Flex direction="row" justify="space-between" p={5}>
          <Box flex="1">
            <QuestionForm addQuestion={addQuestion}  />
          </Box>
          <Box flex="2">
            <QuestionTable questions={questions} />
          </Box>
        </Flex>
    );
}

export default Form;