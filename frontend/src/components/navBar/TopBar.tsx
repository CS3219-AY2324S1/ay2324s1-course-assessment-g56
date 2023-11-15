'use client';

import {
  Flex,
  FlexProps,
  HStack,
  IconButton,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiMenu, FiMoon, FiSun } from 'react-icons/fi';
import NextLink from 'next/link';
import { useUserData } from '@/hooks/useUserData';
import NavButton from './NavButton';
import UserPopover from './UserPopover';

interface TopBarProps extends FlexProps {
  onOpen: () => void;
  showSideBar?: boolean;
}

function TopBar({ onOpen, showSideBar = true, ...rest }: TopBarProps) {
  const { toggleColorMode } = useColorMode();
  const text = useColorModeValue('dark', 'light');
  const SwitchIcon = useColorModeValue(FiMoon, FiSun);
  const { data: profileData, isPending } = useUserData();
  return (
    <Flex
      ml={{ base: 0, md: showSideBar ? 60 : 0 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{
        base: 'space-between',
        md: showSideBar ? 'flex-end' : 'space-between',
      }}
      {...rest}
    >
      <HStack spacing={6}>
        <IconButton
          display={{ base: 'flex', md: showSideBar ? 'none' : 'flex' }}
          onClick={onOpen}
          variant="outline"
          aria-label="open menu"
          icon={<FiMenu />}
        />

        <Text
          as={NextLink}
          display={{ base: 'flex', md: showSideBar ? 'none' : 'flex' }}
          fontSize="2xl"
          fontFamily="monospace"
          fontWeight="bold"
          href="/"
        >
          PeerPrep
        </Text>
      </HStack>

      <HStack spacing={{ base: '0', md: '6' }}>
        <NavButton
          icon={SwitchIcon}
          label={`Switch to ${text} mode`}
          onClick={toggleColorMode}
        />
        {!isPending && <UserPopover profileData={profileData!} />}
      </HStack>
    </Flex>
  );
}

export default TopBar;
