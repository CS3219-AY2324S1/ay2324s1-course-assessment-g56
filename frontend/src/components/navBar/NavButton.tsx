'use client';

import { ReactElement } from 'react';
import { As, Button, ButtonProps, HStack, Icon, Text } from '@chakra-ui/react';

interface NavButtonProps extends ButtonProps {
  icon: As;
  label: string;
}

function NavButton(
  props: NavButtonProps,
): ReactElement<NavButtonProps, typeof Button> {
  const { icon, label, ...buttonProps } = props;
  return (
    <Button justifyContent="start" variant="ghost" {...buttonProps}>
      <HStack spacing={3}>
        <Icon as={icon} boxSize={6} color="subtle" />
        <Text display={{ base: 'none', md: 'undefined' }}>{label}</Text>
      </HStack>
    </Button>
  );
}

export default NavButton;
