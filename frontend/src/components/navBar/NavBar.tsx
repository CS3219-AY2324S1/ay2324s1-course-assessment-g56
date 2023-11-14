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
  showSideBar?: boolean;
}

function Navbar({ children, showSideBar = true }: NavBarProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box
      minH="100vh"
      minW="100%"
      display="inline-table"
      bg={useColorModeValue('gray.100', 'gray.800')}
    >
      {showSideBar && (
        <SideBar onClose={onClose} display={{ base: 'none', md: 'block' }} />
      )}
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        styleConfig={{ width: { base: 'full', md: 'xs' } }}
      >
        <DrawerContent>
          <SideBar onClose={onClose} isDrawer={!showSideBar} />
        </DrawerContent>
      </Drawer>
      <TopBar onOpen={onOpen} showSideBar={showSideBar} />
      <Box ml={{ base: 0, md: showSideBar ? 64 : 0 }} m={showSideBar ? 4 : 0}>
        {children}
      </Box>
    </Box>
  );
}

export default Navbar;
