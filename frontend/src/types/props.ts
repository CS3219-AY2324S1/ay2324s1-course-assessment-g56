import { As, BoxProps, ButtonProps, FlexProps } from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { ChangeEvent, MutableRefObject, ReactNode } from 'react';
import { Question } from './question';

export interface LinkWithIconProps {
  name: string;
  icon: IconType;
}
export interface NavButtonProps extends ButtonProps {
  icon: As;
  label: string;
}

export interface NavBarProps {
  children?: ReactNode;
}

export interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactNode;
}

export interface MobileProps extends FlexProps {
  onOpen: () => void;
}

export interface SideBarProps extends BoxProps {
  onClose: () => void;
}

export interface QuestionFormProps {
  changeTitle: (e: ChangeEvent<HTMLInputElement>) => void;
  changeDescription: (e: ChangeEvent<HTMLInputElement>) => void;
  changeCategories: (e: ChangeEvent<HTMLInputElement>) => void;
  changeComplexity: (e: ChangeEvent<HTMLSelectElement>) => void;
  initialRef: MutableRefObject<null>;
}

export interface QuestionTableProps {
  questions: Question[];
  deleteQuestion: (id: number) => void;
}
