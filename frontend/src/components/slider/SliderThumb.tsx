import { Box, useColorModeValue } from '@chakra-ui/react';
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
      boxSize={8}
      bgColor={bgColor}
      borderRadius="full"
      transform="translateX(-50%)"
      mt={-4}
      _focus={{
        backgroundColor: useColorModeValue('teal.800', 'teal.100'),
        outline: 'none',
      }}
      onKeyDown={(e) => {
        onKeyDownStepBy(e, thumbIndex);
      }}
      {...thumbProps}
    />
  );
}
