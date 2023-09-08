import { As, BoxProps, ButtonProps, FlexProps } from '@chakra-ui/react';
import { IconType } from 'react-icons';

export interface LinkWithIconProps {
  name: string;
  icon: IconType;
}
export interface NavButtonProps extends ButtonProps {
  icon: As;
  label: string;
}

export interface NavBarProps {
  children?: React.ReactNode;
}

export interface NavItemProps extends FlexProps {
  icon: IconType;
  children: React.ReactNode;
}

export interface MobileProps extends FlexProps {
  onOpen: () => void;
}

export interface SideBarProps extends BoxProps {
  onClose: () => void;
}
