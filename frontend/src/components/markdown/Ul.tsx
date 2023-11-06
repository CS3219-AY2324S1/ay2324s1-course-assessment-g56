import { chakra } from '@chakra-ui/react';

function ul({ children, ...props }) {
  return (
    <chakra.ul ml={5} {...props}>
      {children}
    </chakra.ul>
  );
}

export default ul;
