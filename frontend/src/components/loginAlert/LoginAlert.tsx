// pages/loginAlert.tsx
import { Button, Box, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';

export default function LoginAlert() {
  const router = useRouter();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Text fontSize="xl" mb={4}>
        Please log in
      </Text>
      <Text mb={4}>You need to be logged in to access this page.</Text>
      <Button onClick={() => router.push('/')}>Go to Login</Button>
    </Box>
  );
}
