// components/Rating.tsx
import { Box, UseRadioProps, useRadio } from '@chakra-ui/react';
import { useFlexStyle } from '@/styles/styles';
interface InputProps extends UseRadioProps {
  children: React.ReactNode;
}

const Rating: React.FC<InputProps> = (props) => {
  const flexStyle = useFlexStyle();
  const { getInputProps, getRadioProps } = useRadio(props);
  const input = getInputProps();
  const checkbox = getRadioProps();

  const idAttr = `${props.id}${props.value}`;

  return (
    <Box as="label">
      <input {...input} id={idAttr} name={props.name} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        bgColor={flexStyle.fieldColor}
        color={flexStyle.color}
        _checked={{
          bg: 'teal.600',
          color: 'white',
          borderColor: 'teal.600',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        px={{ base: '4', sm: '5', md: '5', lg: '5' }}
        py={{ base: '2', sm: '3', md: '3', lg: '3' }}
      >
        {props.children}
      </Box>
    </Box>
  );
};

Rating.displayName = 'Rating';

export default Rating;
