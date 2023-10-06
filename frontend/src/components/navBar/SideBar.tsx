'use client';

import {
  Box,
  BoxProps,
  CloseButton,
  Flex,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiHome, FiSettings } from 'react-icons/fi';
import { LuUnplug } from 'react-icons/lu';
import { IconType } from 'react-icons';
import NextLink from 'next/link';
import SideBarChild from './SideBarChild';

interface LinkWithIconProps {
  name: string;
  icon: IconType;
  href: string;
}

interface SideBarProps extends BoxProps {
  onClose: () => void;
}

const LinkItems: LinkWithIconProps[] = [
  { name: 'Home', icon: FiHome, href: '/home' },
  { name: 'Find Match', icon: LuUnplug, href: '/matching' },
  { name: 'Settings', icon: FiSettings, href: '/account' },
];

function SideBar({ onClose, ...rest }: SideBarProps) {
  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text
          as={NextLink}
          href="/"
          fontSize="2xl"
          fontFamily="monospace"
          fontWeight="bold"
        >
          PeerPrep
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <SideBarChild
          key={link.name}
          name={link.name}
          icon={link.icon}
          href={link.href}
        />
      ))}
    </Box>
  );
}

export default SideBar;
