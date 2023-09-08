'use client';

import { Box, Button, Text, useColorMode } from '@chakra-ui/react';

export default function Page() {
  const { toggleColorMode } = useColorMode();
  return (
    <Box textAlign="center" fontSize="xl">
      <Text>Welcome to Chakra UI + Next.js</Text>
      <Button onClick={toggleColorMode}>Toggle Colour</Button>
    </Box>
  );
}
