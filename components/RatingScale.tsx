import { Controller } from 'react-hook-form';
import React from 'react';
import {
  useRadioGroup,
  HStack,
  FormControl,
  FormLabel,
  RadioGroup,
  FormErrorMessage,
  Text,
} from '@chakra-ui/react';

import Rating from './Rating';

interface RatingScaleProps {
  index: number;
  fieldErrors: any;
  question_text: any;
  ratingName: string;
  defaultValue: string;
  control: any;
}

const RatingScale: React.FC<RatingScaleProps> = ({
  index,
  fieldErrors,
  question_text,
  ratingName,
  defaultValue,
  control,
}) => {
  const ratingOptions = ['1', '2', '3', '4', '5'];

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: ratingName,
    defaultValue: defaultValue,
  });

  const radioGroup = getRootProps();
  return (
    <FormControl
      key={index}
      isInvalid={!!fieldErrors}
      h={{ base: 'auto', sm: '106.5px', md: '106.5px', lg: '106.5px' }}
    >
      <FormLabel>
        {question_text}{' '}
        <Text as="span" color="teal" fontSize="sm">
          (Required)
        </Text>
      </FormLabel>
      <RadioGroup name={ratingName}>
        <Controller
          name={ratingName}
          control={control}
          rules={{ required: 'This rating is required' }}
          render={({ field }) => {
            return (
              <HStack {...radioGroup} onChange={field.onChange}>
                {ratingOptions.map((value) => {
                  const radio = getRadioProps({
                    value,
                  });
                  return (
                    <Rating key={value} {...radio} id={ratingName} name={ratingName} value={value}>
                      {value}
                    </Rating>
                  );
                })}
              </HStack>
            );
          }}
        />
      </RadioGroup>
      <FormErrorMessage>{fieldErrors && fieldErrors.message}</FormErrorMessage>
    </FormControl>
  );
};

export default RatingScale;
