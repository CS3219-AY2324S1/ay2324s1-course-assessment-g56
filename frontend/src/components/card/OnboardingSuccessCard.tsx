import {
  Card,
  CardHeader,
  Heading,
  CardBody,
  Icon,
  CardFooter,
  Button,
} from '@chakra-ui/react';
import { FaRegCircleCheck } from 'react-icons/fa6';
import NextLink from 'next/link';

function OnboardingSuccessCard() {
  return (
    <Card align="center">
      <CardHeader>
        <Heading size="lg">You&apos;re All Set!</Heading>
      </CardHeader>
      <CardBody>
        <Icon as={FaRegCircleCheck} boxSize={32} color="green.500" />
      </CardBody>
      <CardFooter>
        <Button as={NextLink} href="/matching" colorScheme="blue">
          Start Matching!
        </Button>
      </CardFooter>
    </Card>
  );
}

export default OnboardingSuccessCard;
