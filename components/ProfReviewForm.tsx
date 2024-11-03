import { useForm, SubmitHandler, FieldValues, Controller } from 'react-hook-form';
import React, { useEffect } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Select,
  useRadioGroup,
  HStack,
  Radio,
  RadioGroup,
  Stack,
  Flex,
  useDisclosure,
  Text,
} from '@chakra-ui/react';

import Rating from './Rating';
import ConfirmationModal from './ConfirmationModal';
import { Textarea } from '@nextui-org/react';

export interface FormValues extends FieldValues {
  courseName: string;
  term: string;
  sectionCode: string;
  professor: string;
  difficultyRating: string;
  responsivenessRating: string;
  engagementRating: string;
  knowledgeRating: string;
  gradingFairnessRating: string;
  clarityRating: string;
  takeAgain: Boolean;
  // grade: string;
  // tags: Array<string>;
  // existingTags: Array<string>;
  courseDelivery: '';
  comments: Array<string>;
}

interface ReviewFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const defaultFormVal: FormValues = {
  courseName: '',
  term: '',
  sectionCode: '',
  professor: '',
  difficultyRating: '1',
  responsivenessRating: '1',
  engagementRating: '1',
  knowledgeRating: '1',
  gradingFairnessRating: '1',
  clarityRating: '1',
  takeAgain: false,
  // grade: '',
  // tags: [],
  // existingTags: [],
  courseDelivery: '',
  comments: [],
};

const ProfReviewForm: React.FC<ReviewFormProps> = ({ isOpen, onClose }) => {
  const {
    reset,
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: defaultFormVal,
  });

  const ratingOptions = ['1', '2', '3', '4', '5'];

  const useCreateRatingRadioGroup = ({
    name,
    defaultValue,
  }: {
    name: string;
    defaultValue: string;
  }) => {
    const { getRootProps, getRadioProps } = useRadioGroup({
      name,
      defaultValue,
    });
    const radioGroup = getRootProps();
    // console.log('radioGroup name', radioGroup.name);
    return { radioGroup, getRadioProps };
  };

  // Difficulty Rating Radio Group
  const { radioGroup: difficultyGroup, getRadioProps: getDifficultyRadioProps } =
    useCreateRatingRadioGroup({
      name: 'difficultyRating',
      defaultValue: '1',
    });

  // Responsiveness Rating Radio Group
  const { radioGroup: responsivenessGroup, getRadioProps: getResponsivenessRadioProps } =
    useCreateRatingRadioGroup({
      name: 'responsivenessRating',
      defaultValue: '1',
    });

  // Engagement Rating Radio Group
  const { radioGroup: engagementGroup, getRadioProps: getEngagementRadioProps } =
    useCreateRatingRadioGroup({
      name: 'engagementRating',
      defaultValue: '1',
    });

  // Knowledge Rating Radio Group
  const { radioGroup: knowledgeGroup, getRadioProps: getKnowledgeRadioProps } =
    useCreateRatingRadioGroup({
      name: 'knowledgeRating',
      defaultValue: '1',
    });

  // Grading Fairness Rating Radio Group
  const { radioGroup: gradingFairnessGroup, getRadioProps: getGradingFairnessRadioProps } =
    useCreateRatingRadioGroup({
      name: 'gradingFairnessRating',
      defaultValue: '1',
    });

  const { radioGroup: clarityGroup, getRadioProps: getClarityRadioProps } =
    useCreateRatingRadioGroup({
      name: 'clarityRating',
      defaultValue: '1',
    });

  // Confirmation on closing form Modal <ConfirmationModal />:
  const {
    isOpen: isConfirmModalOpen,
    onOpen: openConfirmModal,
    onClose: closeConfirmModal,
  } = useDisclosure();

  // Confirmation on form submission success Modal <ConfirmationModal />:
  const {
    isOpen: isSuccessConfirmModalOpen,
    onOpen: openSuccessConfirmModal,
    onClose: closeSuccessConfirmModal,
  } = useDisclosure();

  useEffect(() => {
    let data: FormValues = defaultFormVal;

    if (!isOpen) {
      // console.log('Form closed');
      // onReset();
      reset(defaultFormVal);
      return;
    }

    // set the values of each form field to match "data"
    for (const prop in data) {
      setValue(prop as string, data[prop as keyof FormValues]);
    }
  }, [isOpen, reset, setValue]);

  const submitForm: SubmitHandler<FormValues> = async (data) => {
    console.log(`Submitting form with the following data:`);
    console.log(data);

    // Make a fetch call to the api to POST the professor review:
    try {
      await fetch(`/api/reviews/professors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      // If submitted successfully, display success modal:
      openSuccessConfirmModal();
    } catch (error) {
      console.error('Error', { error });
    }
  };

  const handleFormModalClose = () => {
    openConfirmModal();
  };

  return (
    <>
      <Modal
        onClose={handleFormModalClose}
        isOpen={isOpen}
        isCentered
        size="full"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color="teal" fontSize={{ base: '24', sm: '30', md: '30', lg: '36' }}>
            Add Review
          </ModalHeader>
          <ModalCloseButton color="black" bgColor="gray.200" m={2} />
          <ModalBody color="black">
            <form onSubmit={handleSubmit(submitForm)}>
              <Flex gap={10} wrap="wrap" direction={{ base: 'column', md: 'column', lg: 'row' }}>
                <Flex flex="1" gap={5} direction="column">
                  <FormControl isInvalid={!!errors.professor}>
                    <FormLabel htmlFor="professor">
                      Professor:{' '}
                      <Text as="span" color="teal" fontSize="sm">
                        (Required)
                      </Text>
                    </FormLabel>
                    <Select
                      id="professor"
                      placeholder="Add existing professor(s)..."
                      {...register('professor', {
                        required: 'Professor is required. Please select from the list.',
                      })}
                    >
                      <option value="peter wan">Peter Wan</option>
                      <option value="john smith">John Smith</option>
                    </Select>

                    <FormErrorMessage>
                      {errors.professor && errors.professor.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.term}>
                    <FormLabel htmlFor="term">
                      Term:{' '}
                      <Text as="span" color="teal" fontSize="sm">
                        (Required)
                      </Text>
                    </FormLabel>
                    <Input
                      id="term"
                      placeholder="Follow Format SEMESTER YEAR (Winter 2024, Fall 2023, etr)"
                      {...register('term', {
                        required: 'Term is required. Please enter the term this course is taken.',
                      })}
                    />

                    <FormErrorMessage>{errors.term && errors.term.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.courseName}>
                    <FormLabel htmlFor="course-name">
                      Course Name:{' '}
                      <Text as="span" color="teal" fontSize="sm">
                        (Required)
                      </Text>
                    </FormLabel>
                    <Select
                      id="course-name"
                      placeholder="Select from existing courses..."
                      {...register('courseName', {
                        required: 'Course name is required. Please select from the list.',
                      })}
                    >
                      <option value="abc">ABC</option>
                      <option value="xyz">XYZ</option>
                    </Select>
                    <FormErrorMessage>
                      {errors.courseName && errors.courseName.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.sectionCode}>
                    <FormLabel htmlFor="section-code">
                      Section Code:{' '}
                      <Text as="span" color="teal" fontSize="sm">
                        (Required)
                      </Text>
                    </FormLabel>
                    <Select
                      id="section-code"
                      placeholder="Select from existing sections..."
                      {...register('sectionCode', {
                        required: 'Course section is required. Please select from the list.',
                      })}
                    >
                      <option value="nzz">NZZ</option>
                      <option value="ncc">NCC</option>
                    </Select>

                    <FormErrorMessage>
                      {errors.sectionCode && errors.sectionCode.message}
                    </FormErrorMessage>
                  </FormControl>

                  {/**** Included Profs: Need to discuss how this is implemented *****/}

                  <Flex gap={5} wrap="wrap">
                    <Flex gap={5} wrap="wrap">
                      <Flex flex="1" direction="column" gap={5}>
                        <FormControl isInvalid={!!errors.difficultyRating}>
                          <FormLabel>Difficulty:</FormLabel>
                          <RadioGroup name="difficultyRating" id="difficultyRating">
                            <Controller
                              name="difficultyRating"
                              control={control}
                              rules={{ required: 'This rating is required' }}
                              render={({ field }) => {
                                return (
                                  <HStack {...difficultyGroup} onChange={field.onChange}>
                                    {ratingOptions.map((value) => {
                                      const radio = getDifficultyRadioProps({ value });
                                      return (
                                        <Rating
                                          key={value}
                                          {...radio}
                                          id={`difficultyRating-${value}`}
                                          name={`difficultyRating`}
                                        >
                                          {value}
                                        </Rating>
                                      );
                                    })}
                                  </HStack>
                                );
                              }}
                            />
                          </RadioGroup>
                          <FormErrorMessage>
                            {errors.difficultyRating && errors.difficultyRating.message}
                          </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.responsivenessRating}>
                          <FormLabel>Responsiveness:</FormLabel>
                          <RadioGroup name="responsivenessRating">
                            <Controller
                              name="responsivenessRating"
                              control={control}
                              rules={{ required: 'This rating is required' }}
                              render={({ field }) => {
                                return (
                                  <HStack {...responsivenessGroup} onChange={field.onChange}>
                                    {ratingOptions.map((value) => {
                                      const radio = getResponsivenessRadioProps({ value });
                                      return (
                                        <Rating
                                          key={value}
                                          {...radio}
                                          id={`responsivenessRating-${value}`}
                                          name={`responsivenessRating`}
                                        >
                                          {value}
                                        </Rating>
                                      );
                                    })}
                                  </HStack>
                                );
                              }}
                            />
                          </RadioGroup>
                          <FormErrorMessage>
                            {errors.responsivenessRating && errors.responsivenessRating.message}
                          </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.engagementRating}>
                          <FormLabel>Engagement:</FormLabel>
                          <RadioGroup name="engagementRating">
                            <Controller
                              name="engagementRating"
                              control={control}
                              rules={{ required: 'This rating is required' }}
                              render={({ field }) => {
                                return (
                                  <HStack {...engagementGroup} onChange={field.onChange}>
                                    {ratingOptions.map((value) => {
                                      const radio = getEngagementRadioProps({ value });
                                      return (
                                        <Rating
                                          key={value}
                                          {...radio}
                                          id={`engagementRating-${value}`}
                                          name={`engagementRating`}
                                        >
                                          {value}
                                        </Rating>
                                      );
                                    })}
                                  </HStack>
                                );
                              }}
                            />
                          </RadioGroup>
                          <FormErrorMessage>
                            {errors.engagementRating && errors.engagementRating.message}
                          </FormErrorMessage>
                        </FormControl>
                      </Flex>

                      <Flex flex="1" direction="column" gap={5}>
                        <FormControl isInvalid={!!errors.knowledgeRating}>
                          <FormLabel>Knowledge:</FormLabel>
                          <RadioGroup name="knowledgeRating" id="course-structure">
                            <Controller
                              name="knowledgeRating"
                              control={control}
                              rules={{ required: 'This rating is required' }}
                              render={({ field }) => {
                                return (
                                  <HStack {...knowledgeGroup} onChange={field.onChange}>
                                    {ratingOptions.map((value) => {
                                      const radio = getKnowledgeRadioProps({ value });
                                      return (
                                        <Rating
                                          key={value}
                                          {...radio}
                                          id={`knowledgeRating-${value}`}
                                          name={`knowledgeRating`}
                                        >
                                          {value}
                                        </Rating>
                                      );
                                    })}
                                  </HStack>
                                );
                              }}
                            />
                          </RadioGroup>
                          <FormErrorMessage>
                            {errors.knowledgeRating && errors.knowledgeRating.message}
                          </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.gradingFairnessRating}>
                          <FormLabel>Grading Fairness:</FormLabel>
                          <RadioGroup name="gradingFairnessRating" id="evaluation-fairness">
                            <Controller
                              name="gradingFairnessRating"
                              control={control}
                              rules={{ required: 'This rating is required' }}
                              render={({ field }) => {
                                return (
                                  <HStack {...gradingFairnessGroup} onChange={field.onChange}>
                                    {ratingOptions.map((value) => {
                                      const radio = getGradingFairnessRadioProps({ value });
                                      return (
                                        <Rating
                                          key={value}
                                          {...radio}
                                          id={`gradingFairnessRating-${value}`}
                                          name={`gradingFairnessRating`}
                                        >
                                          {value}
                                        </Rating>
                                      );
                                    })}
                                  </HStack>
                                );
                              }}
                            />
                          </RadioGroup>
                          <FormErrorMessage>
                            {errors.gradingFairnessRating && errors.gradingFairnessRating.message}
                          </FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.clarityRating}>
                          <FormLabel>Clarity:</FormLabel>
                          <RadioGroup name="clarityRating" id="evaluation-fairness">
                            <Controller
                              name="clarityRating"
                              control={control}
                              rules={{ required: 'This rating is required' }}
                              render={({ field }) => {
                                return (
                                  <HStack {...clarityGroup} onChange={field.onChange}>
                                    {ratingOptions.map((value) => {
                                      const radio = getClarityRadioProps({ value });
                                      return (
                                        <Rating
                                          key={value}
                                          {...radio}
                                          id={`clarityRating-${value}`}
                                          name={`clarityRating`}
                                        >
                                          {value}
                                        </Rating>
                                      );
                                    })}
                                  </HStack>
                                );
                              }}
                            />
                          </RadioGroup>
                          <FormErrorMessage>
                            {errors.clarityRating && errors.clarityRating.message}
                          </FormErrorMessage>
                        </FormControl>
                      </Flex>
                    </Flex>
                    <FormControl flex="1">
                      <FormLabel whiteSpace="nowrap">Would Take Again:</FormLabel>
                      <RadioGroup defaultValue="yes" name="takeAgain">
                        <Stack direction="row" spacing={4}>
                          <Radio value="yes" id="takeAgain-yes" {...register('takeAgain')}>
                            Yes
                          </Radio>
                          <Radio value="no" id="takeAgain-no" {...register('takeAgain')}>
                            No
                          </Radio>
                        </Stack>
                      </RadioGroup>
                    </FormControl>
                  </Flex>

                  {/**** Included Tags: Need to discuss how this is implemented *****/}
                </Flex>
                <Flex flex="1" direction="column" gap={10}>
                  <Flex direction="column" gap={5}>
                    <FormControl isInvalid={!!errors.courseDelivery}>
                      <FormLabel htmlFor="course-delivery">Course Delivery:</FormLabel>
                      <Select
                        id="course-delivery"
                        placeholder="Select course delivery..."
                        {...register('courseDelivery')}
                      >
                        <option value="OA">Online Asynchronous</option>
                        <option value="OS">Online Synchronous</option>
                        <option value="IN">In-person</option>
                        <option value="HY">Hybrid</option>
                      </Select>
                      <FormErrorMessage>
                        {errors.courseDelivery && errors.courseDelivery.message}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.comments}>
                      <FormLabel htmlFor="comments">Comments:</FormLabel>
                      <Textarea
                        id="comments"
                        placeholder="Anything else you would like to share..."
                        {...register('comments')}
                      />
                      <FormErrorMessage>
                        {errors.comments && errors.comments.message}
                      </FormErrorMessage>
                    </FormControl>
                  </Flex>
                  <Button
                    type="submit"
                    disabled={Object.keys(errors).length > 0}
                    alignSelf="end"
                    colorScheme="teal"
                    isLoading={isSubmitting}
                  >
                    Submit
                  </Button>
                </Flex>
              </Flex>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
      {/* Confirmation Modal: Close Form Warning */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        closeFormModal={onClose}
        closeConfirmModal={closeConfirmModal}
        // resetForm={onReset}
        isWarning={true}
        title="Discard Changes"
        message="Are you sure you want
            to discard all changes?"
        confirmBtnText="Yes"
      />
      {/* Confirmation Modal: Form Submission Success */}
      <ConfirmationModal
        isOpen={isSuccessConfirmModalOpen}
        closeFormModal={onClose}
        closeConfirmModal={closeSuccessConfirmModal}
        // resetForm={onReset}
        isWarning={false}
        title="Review Submitted!"
        message="Your review has been submitted successfully."
        confirmBtnText="OK"
      />
    </>
  );
};

export default ProfReviewForm;
