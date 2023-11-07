// ErrorBoundary.tsx
import React, { Component, ReactNode } from 'react';
import { Button, Heading, Box } from '@chakra-ui/react';
import NextLink from 'next/link';

interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  interval: NodeJS.Timeout | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  override componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  override render() {
    const { hasError } = this.state;
    const { children } = this.props;
    if (hasError) {
      // You can render any custom fallback UI
      return (
        <Box textAlign="center" p={5}>
          <Heading mb={4}>Room not found</Heading>
          <Button as={NextLink} href="/" colorScheme="green" variant="outline">
            Go to home page
          </Button>{' '}
        </Box>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
