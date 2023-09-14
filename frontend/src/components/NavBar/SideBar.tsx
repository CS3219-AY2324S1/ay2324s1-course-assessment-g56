'use client';

import {
  Box,
  CloseButton,
  Flex,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  FiHome,
  FiCompass,
  FiSettings,
  FiStar,
  FiTrendingUp,
} from 'react-icons/fi';
import { LinkWithIconProps, SideBarProps } from '@/types/props';
import SideBarChild from './SideBarChild';

const LinkItems: LinkWithIconProps[] = [
  { name: 'Home', icon: FiHome },
  { name: 'Trending', icon: FiTrendingUp },
  { name: 'Explore', icon: FiCompass },
  { name: 'Favourites', icon: FiStar },
  { name: 'Settings', icon: FiSettings },
];

function SideBar({ onClose, ...rest }: SideBarProps) {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Logo
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <SideBarChild key={link.name} icon={link.icon}>
          {link.name}
        </SideBarChild>
      ))}
    </Box>
  );
}

export default SideBar;
