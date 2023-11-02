'use client';

import {
  Box,
  Drawer,
  DrawerContent,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import SideBar from './SideBar';
import TopBar from './TopBar';

interface NavBarProps {
  children?: ReactNode;
}

function Navbar(props: NavBarProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { children } = props;
  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.800')}>
      <SideBar onClose={onClose} display={{ base: 'none', md: 'block' }} />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SideBar onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <TopBar onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

export default Navbar;
