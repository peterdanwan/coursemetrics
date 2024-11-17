// components/RatingScale.tsx
import { Controller } from 'react-hook-form';
import React from 'react';
import {
  useRadioGroup,
  HStack,
  FormControl,
  FormLabel,
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
  question_id: string;
}

const RatingGroup: React.FC<{
  name: string;
  value: string;
  onChange: (value: string) => void;
  question_id: string;
}> = ({ name, value, onChange, question_id }) => {
  const ratingOptions = ['1', '2', '3', '4', '5'];

  const { getRootProps, getRadioProps } = useRadioGroup({
    name,
    value,
    onChange,
  });

  const group = getRootProps();

  return (
    <HStack {...group} spacing={4}>
      {ratingOptions.map((optionValue) => {
        const radio = getRadioProps({ value: optionValue });
        return (
          <Rating key={`${question_id}-${optionValue}`} {...radio}>
            {optionValue}
          </Rating>
        );
      })}
    </HStack>
  );
};

const RatingScale: React.FC<RatingScaleProps> = ({
  index,
  fieldErrors,
  question_text,
  control,
  question_id,
}) => {
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
      <Controller
        name={`questions.${index}.answer`}
        control={control}
        rules={{ required: 'This field is required' }}
        render={({ field }) => {
          return (
            <RatingGroup
              name={`rating-${question_id}`}
              value={field.value}
              onChange={field.onChange}
              question_id={question_id}
            />
          );
        }}
      />
      <FormErrorMessage>{fieldErrors && fieldErrors.message}</FormErrorMessage>
    </FormControl>
  );
};

export default RatingScale;
