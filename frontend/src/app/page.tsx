'use client';

import { Box, Flex, Text, useToast } from '@chakra-ui/react';
import React, { Suspense, useEffect } from 'react';
import AuthForm from '@/components/login/AuthForm';
import { useSearchParams } from 'next/navigation';
import 'dotenv/config';

export default function Page() {
  const searchParams = useSearchParams();
  const isUnauthorised = searchParams.has('return_to');
  const returnUrl = searchParams.get('return_to') || '/home';
  const toast = useToast();
  useEffect(() => {
    if (isUnauthorised) {
      toast({
        title: 'Unauthorised. Please login to continue.',
        status: 'error',
        containerStyle: {
          marginLeft: 0,
        },
      });
    }
  }, []);
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
          <AuthForm returnUrl={returnUrl} />
        </Box>
      </Flex>
    </Suspense>
  );
}
