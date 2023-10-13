import { Box } from '@chakra-ui/react';
import { KeyboardEvent } from 'react';

type Props = {
  thumbIndex: number;
  thumbProps: any;
  bgColor: string;
  onKeyDownStepBy: (
    e: KeyboardEvent<HTMLDivElement>,
    thumbIndex: number,
  ) => void;
};

export default function Thumb({
  bgColor,
  thumbIndex,
  thumbProps,
  onKeyDownStepBy,
}: Props) {
  return (
    <Box
      top="1%"
      boxSize={8}
      bgColor={bgColor}
      borderRadius="full"
      _focusVisible={{
        outline: 'none',
      }}
      onKeyDown={(e) => {
        onKeyDownStepBy(e, thumbIndex);
      }}
      {...thumbProps}
    />
  );
}
