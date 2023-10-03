'use client';

import {
  Avatar,
  Box,
  Flex,
  HStack,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { FiChevronDown } from 'react-icons/fi';

function UserPopover() {
  return (
    <Flex alignItems="center">
      <Menu>
        <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
          <HStack>
            <Avatar
              name="Justina Clark"
              size="sm"
              src="https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
            />
            <VStack
              display={{ base: 'none', md: 'flex' }}
              alignItems="flex-start"
              spacing="1px"
              ml="2"
            >
              <Text fontSize="sm">Justina Clark</Text>
              <Text fontSize="xs" color="gray.600">
                Admin
              </Text>
            </VStack>
            <Box display={{ base: 'none', md: 'flex' }}>
              <FiChevronDown />
            </Box>
          </HStack>
        </MenuButton>
        <MenuList
          bg={useColorModeValue('white', 'gray.900')}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
        >
          <Link href="/profile/ff8a55f9-fb2d-4ca2-b8ee-4ac410923f64">
            {/* TODO: REMOVE ONCE LOGIN AUTHENTICATION OBTAINED */}
            <MenuItem>Profile</MenuItem>
          </Link>
          <MenuItem>Settings</MenuItem>
          <MenuItem>Billing</MenuItem>
          <MenuDivider />
          <MenuItem>Sign out</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
}

export default UserPopover;
