import {
  Radio,
  RadioGroup,
  Box,
  UseRadioProps,
  useRadio,
  Input,
  FormLabel,
} from '@chakra-ui/react';
import { forwardRef, InputHTMLAttributes } from 'react';
import { UseFormRegister, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { FormValues } from './CourseReviewForm';

interface InputProps extends UseRadioProps {
  children: React.ReactNode;
  // name: string;
  // register: UseFormRegister<FormValues>;
}

// 1. Create a component that consumes the `useRadio` hook
// const Rating = forwardRef({props: InputProps}, ref) => {
const Rating = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  // const { children, , name } = props;
  const { getInputProps, getRadioProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();

  // console.log('checkbox input');
  // console.log(input.name, input.value, input.checked);

  return (
    <Box as="label">
      <input {...input} id={props.id} name={props.name} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: 'teal.600',
          color: 'white',
          borderColor: 'teal.600',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        px={5}
        py={3}
      >
        <FormLabel m={0} htmlFor={props.id}>
          {props.children}
        </FormLabel>
      </Box>
    </Box>
  );
});

Rating.displayName = 'Rating';

export default Rating;
