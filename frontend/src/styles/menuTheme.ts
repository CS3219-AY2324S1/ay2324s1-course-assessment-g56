import { menuAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(menuAnatomy.keys);

// define the base component styles
const baseStyle = definePartsStyle(({ colorMode }) => ({
  // define the part you're going to style
  list: {
    // this will style the MenuList component
    bg: colorMode === 'light' ? 'white' : 'gray.900',
    borderColor: colorMode === 'light' ? 'gray.200' : 'gray.700',
  },
  item: {
    // this will style the MenuItem and MenuItemOption components
    bg: colorMode === 'light' ? 'white' : 'gray.900',
    _hover: {
      bg: colorMode === 'light' ? 'gray.100' : 'gray.800',
    },
    _focus: {
      bg: colorMode === 'light' ? 'gray.100' : 'gray.800',
    },
  },
}));
// export the base styles in the component theme
const menuTheme = defineMultiStyleConfig({ baseStyle });
export default menuTheme;
