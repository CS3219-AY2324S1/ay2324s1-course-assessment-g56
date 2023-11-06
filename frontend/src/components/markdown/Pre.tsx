import { chakra } from '@chakra-ui/react';

function pre({ children, ...props }) {
  return <chakra.pre {...props}>{children}</chakra.pre>;
}

export default pre;
