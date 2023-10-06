import { extendTheme } from '@chakra-ui/react';
import menuTheme from './menuTheme';

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  components: {
    Menu: menuTheme,
  },
});

export default theme;
