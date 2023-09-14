'use client';

import { ReactElement } from 'react';
import { Button, HStack, Icon, Show, Text } from '@chakra-ui/react';
import { NavButtonProps } from '@/types/props';

function NavButton(
  props: NavButtonProps,
): ReactElement<NavButtonProps, typeof Button> {
  const { icon, label, ...buttonProps } = props;
  return (
    <Button justifyContent="start" variant="ghost" {...buttonProps}>
      <HStack spacing={3}>
        <Icon as={icon} boxSize={6} color="subtle" />
        <Show above="md">
          <Text>{label}</Text>
        </Show>
      </HStack>
    </Button>
  );
}

export default NavButton;
