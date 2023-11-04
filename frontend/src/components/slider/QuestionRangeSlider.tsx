import {
  Badge,
  Box,
  chakra,
  useColorModeValue,
  useRangeSlider,
} from '@chakra-ui/react';
import { KeyboardEvent, useEffect } from 'react';
import {
  NumberToQuestionDifficultyMap,
  QuestionDifficulty,
} from '@/types/question';
import Thumb from './SliderThumb';

type Props = {
  setLowerBoundDifficulty: (lowerBoundDifficulty: QuestionDifficulty) => void;
  setUpperBoundDifficulty: (upperBoundDifficulty: QuestionDifficulty) => void;
};

export default function QuestionRangeSlider({
  setLowerBoundDifficulty,
  setUpperBoundDifficulty,
}: Props) {
  const sliderOptions = {
    min: 1,
    max: 3,
    defaultValue: [1, 3],
  };

  const {
    state,
    actions,
    getInnerTrackProps,
    getInputProps,
    getMarkerProps,
    getRootProps,
    getThumbProps,
    getTrackProps,
  } = useRangeSlider(sliderOptions);

  const {
    onKeyDown: onThumbKeyDownFirstIndex,
    // eslint no-unused-vars: ["error", { "ignoreRestSiblings": true }]
    role: roleFirstIndex,
    ...thumbPropsFirstIndex
  } = getThumbProps({
    index: 0,
  });

  const {
    onKeyDown: onThumbKeyDownSecondIndex,
    // eslint no-unused-vars: ["error", { "ignoreRestSiblings": true }]
    role: roleSecondIndex,
    ...thumbPropsSecondIndex
  } = getThumbProps({
    index: 1,
  });

  const markers = [1, 2, 3].map((i) => getMarkerProps({ value: i }));

  const onKeyDownStepBy = (
    e: KeyboardEvent<HTMLDivElement>,
    thumbIndex: number,
  ) => {
    if (e.code === 'ArrowRight') {
      actions.stepUp(thumbIndex, 1);
    } else if (e.code === 'ArrowLeft') {
      actions.stepDown(thumbIndex, 1);
    } else if (
      thumbIndex === 0 &&
      typeof onThumbKeyDownFirstIndex === 'function'
    ) {
      onThumbKeyDownFirstIndex(e);
    } else if (
      thumbIndex === 1 &&
      typeof onThumbKeyDownSecondIndex === 'function'
    ) {
      onThumbKeyDownSecondIndex(e);
    }
  };

  useEffect(() => {
    setLowerBoundDifficulty(
      NumberToQuestionDifficultyMap[state.value[0]] as QuestionDifficulty,
    );
  }, [state.value[0]]);

  useEffect(() => {
    setUpperBoundDifficulty(
      NumberToQuestionDifficultyMap[state.value[1]] as QuestionDifficulty,
    );
  }, [state.value[1]]);

  return (
    <Box px={8} width="100%">
      <chakra.div
        mt={2}
        cursor="pointer"
        w={{ base: '96%', lg: '98%' }}
        ml={{ base: '2%', lg: '1%' }}
        {...getRootProps()}
      >
        <input {...getInputProps({ index: 0 })} hidden />
        <input {...getInputProps({ index: 1 })} hidden />
        {markers.map((markerProps, index) => {
          const value = NumberToQuestionDifficultyMap[index + 1];
          return (
            <Badge
              key={value}
              position="relative"
              transform="translateX(-50%)"
              mt="25px"
              fontSize="sm"
              colorScheme="black"
              {...markerProps}
            >
              {value}
            </Badge>
          );
        })}
        <Box
          h="7px"
          bgColor={useColorModeValue('teal.100', 'teal.800')}
          borderRadius="full"
          {...getTrackProps()}
        >
          <Box
            h="7px"
            bgColor={useColorModeValue('teal.500', 'teal.300')}
            borderRadius="full"
            {...getInnerTrackProps()}
          />
        </Box>
        <Thumb
          thumbIndex={0}
          thumbProps={thumbPropsFirstIndex}
          onKeyDownStepBy={onKeyDownStepBy}
          bgColor={useColorModeValue('teal.500', 'teal.300')}
        />
        <Thumb
          thumbIndex={1}
          thumbProps={thumbPropsSecondIndex}
          onKeyDownStepBy={onKeyDownStepBy}
          bgColor={useColorModeValue('teal.500', 'teal.300')}
        />
      </chakra.div>
    </Box>
  );
}
