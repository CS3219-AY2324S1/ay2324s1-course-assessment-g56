'use client';

import { Box, Flex, FlexProps, Icon } from '@chakra-ui/react';
import NextLink from 'next/link';
import { IconType } from 'react-icons';

interface NavItemProps extends FlexProps {
  name: string;
  icon: IconType;
  href: string;
}

function SideBarChild({ name, icon, href, ...rest }: NavItemProps) {
  return (
    <Box
      as={NextLink}
      href={href}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {name}
      </Flex>
    </Box>
  );
}

export default SideBarChild;
