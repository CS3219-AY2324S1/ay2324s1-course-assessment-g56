'use client';

import { Box, Flex, Text } from '@chakra-ui/react';
import React, { Suspense } from 'react';
import AuthForm from '@/components/login/AuthForm';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Flex
        height="100vh"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        bgGradient="linear(to-r, teal.500, green.500)"
      >
        <Text
          fontSize="2xl"
          fontWeight="bold"
          textAlign="center"
          color="white"
          mb={4}
        >
          Welcome to Peer Prep!
          <br />A magic link will be sent to your email for login or sign-up.
        </Text>

        <Box w="50%" p={5} boxShadow="xl" bg="white" borderRadius="md">
          <AuthForm />
        </Box>
      </Flex>
    </Suspense>
  );
}
