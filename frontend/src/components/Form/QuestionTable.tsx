'use client';

import { Box, Table, Thead, Tbody, Tr, Th, Td, Heading } from '@chakra-ui/react';

const QuestionTable = ({ questions }) => {
    return (
        <Box boxShadow="sm" borderRadius="md" overflow="hidden" p={4} bg="white">
            <Heading size="md" mb={4}>Questions</Heading>
            <Table variant="simple" borderWidth="1px" borderColor="black">
                <Thead bg="gray.200">
                    <Tr>
                        <Th border="1px" borderColor="black">Id</Th>
                        <Th border="1px" borderColor="black">Title</Th>
                        <Th border="1px" borderColor="black">Description</Th>
                        <Th border="1px" borderColor="black">Category</Th>
                        <Th border="1px" borderColor="black">Complexity</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {questions.map((question, index) => (
                        <Tr key={index} _hover={{ bg: "gray.50" }}>
                            <Td border="1px" borderColor="black">{question.questionId}</Td>
                            <Td border="1px" borderColor="black">{question.questionTitle}</Td>
                            <Td border="1px" borderColor="black">{question.questionDescription}</Td>
                            <Td border="1px" borderColor="black">{question.questionCategories.join(', ')}</Td>
                            <Td border="1px" borderColor="black">{question.questionComplexity}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
};

export default QuestionTable;
