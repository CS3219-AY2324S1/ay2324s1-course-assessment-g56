'use client';

import { FiArrowDown } from 'react-icons/fi';
import { Icon, IconProps } from '@chakra-ui/react';

interface Props extends IconProps {
  isAscending: boolean;
}

function SortIcon({ isAscending }: Props) {
  const iconStyles = {
    transform: isAscending ? 'rotate(-180deg)' : undefined,
    transition: 'transform 0.2s',
    transformOrigin: 'center',
    margin: '0 0 -1px 3px',
  };
  return <Icon __css={iconStyles} aria-hidden as={FiArrowDown} boxSize={3} />;
}

export default SortIcon;
