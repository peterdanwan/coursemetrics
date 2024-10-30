import { useForm, SubmitHandler } from 'react-hook-form';
import { useEffect } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react';

interface FormValues {
  firstName: string;
  lastName: string;
  age: number;
}

export default function ReviewForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      age: 0,
    },
  });

  useEffect(() => {
    let data: FormValues = {
      firstName: '',
      lastName: '',
      age: 0,
    };

    // set the values of each form field to match "data"
    for (const prop in data) {
      setValue(prop as keyof FormValues, data[prop as keyof FormValues]);
    }
  }, [setValue]);

  const submitForm: SubmitHandler<FormValues> = (data) => {
    console.log(`Submitting form with the following data: ${JSON.stringify(data)}`);
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <FormControl isInvalid={!errors}>
        <FormLabel htmlFor="firstname">First name:</FormLabel> <br />
        <Input
          // className={errors.firstName && 'inputError'}
          id="firstName"
          placeholder="First Name"
          {...register('firstName', { required: 'First Name is required', maxLength: 20 })}
        />
        <FormErrorMessage>{errors.firstName && errors.firstName.message}</FormErrorMessage>
        {/* {errors.firstName?.type === 'required' && (
          <span className="inputErrorText">
            <br />
            First Name is required
          </span> 
        )} */}
        {errors.firstName?.type === 'maxLength' && (
          <span className="inputErrorText">
            <br />
            First Name Cannot contain more than 20 characters
          </span>
        )}
        <br />
        <br />
        Last name: <br />
        <Input
          className={errors?.lastName && 'inputError'}
          {...register('lastName', { pattern: /^[A-Za-z]+$/i })}
        />
        {errors.lastName?.type === 'pattern' && (
          <span className="inputErrorText">
            <br />
            Last Name must only contain letters
          </span>
        )}
        <br />
        <br />
        Age: <br />
        <Input
          className={errors?.age && 'inputError'}
          type="number"
          {...register('age', { min: 18, max: 99 })}
        />
        {errors.age?.type === 'min' && (
          <span className="inputErrorText">
            <br />
            Age must be greater than 17{' '}
          </span>
        )}
        {errors.age?.type === 'max' && (
          <span className="inputErrorText">
            <br />
            age must be less than 100
          </span>
        )}
        <br />
        <br />
        <Button type="submit" disabled={Object.keys(errors).length > 0}>
          Update User
        </Button>
      </FormControl>
    </form>
  );
}
