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
} from '@chakra-ui/react';

import Rating from './Rating';
import ConfirmationModal from './ConfirmationModal';
import { Textarea } from '@nextui-org/react';

export interface FormValues extends FieldValues {
  courseName: string;
  term: string;
  sectionCode: string;
  professor: string;
  existingProfs: Array<string>;
  difficultyRating: string;
  courseLoadRating: string;
  contentQualityRating: string;
  courseStructureRating: string;
  evaluationFairnessRating: string;
  materialRelevanceRating: string;
  takeAgain: Boolean;
  grade: string;
  tags: Array<string>;
  existingTags: Array<string>;
  difficultyReview: Array<string>;
  solution: Array<string>;
  assessmentsReview: Array<string>;
  references: Array<string>;
  otherComment: Array<string>;
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
  existingProfs: [],
  difficultyRating: '1',
  courseLoadRating: '1',
  contentQualityRating: '1',
  courseStructureRating: '1',
  evaluationFairnessRating: '1',
  materialRelevanceRating: '1',
  takeAgain: false,
  grade: '',
  tags: [],
  existingTags: [],
  difficultyReview: [],
  solution: [],
  assessmentsReview: [],
  references: [],
  otherComment: [],
};

const CourseReviewForm: React.FC<ReviewFormProps> = ({ isOpen, onClose }) => {
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
    console.log('radioGroup name', radioGroup.name);
    return { radioGroup, getRadioProps };
  };

  // Difficulty Rating Radio Group
  const { radioGroup: difficultyGroup, getRadioProps: getDifficultyRadioProps } =
    useCreateRatingRadioGroup({
      name: 'difficultyRating',
      defaultValue: '1',
    });

  // Course Load Rating Radio Group
  const { radioGroup: courseLoadGroup, getRadioProps: getCourseLoadRadioProps } =
    useCreateRatingRadioGroup({
      name: 'courseLoadRating',
      defaultValue: '1',
    });

  // Content Quality Rating Radio Group
  const { radioGroup: contentQualityGroup, getRadioProps: getContentQualityRadioProps } =
    useCreateRatingRadioGroup({
      name: 'contentQualityRating',
      defaultValue: '1',
    });

  // Course Structure Rating Radio Group
  const { radioGroup: courseStructureGroup, getRadioProps: getCourseStructureRadioProps } =
    useCreateRatingRadioGroup({
      name: 'courseStructureRating',
      defaultValue: '1',
    });

  // Evaluation Fairness Rating Radio Group
  const { radioGroup: evaluationFairnessGroup, getRadioProps: getEvaluationFairnessRadioProps } =
    useCreateRatingRadioGroup({
      name: 'evaluationFairnessRating',
      defaultValue: '1',
    });

  // Material Relevance Rating Radio Group
  const { radioGroup: materialRelevanceGroup, getRadioProps: getMaterialRelevanceRadioProps } =
    useCreateRatingRadioGroup({
      name: 'materialRelevanceRating',
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

  const submitForm: SubmitHandler<FormValues> = (data) => {
    console.log(`Submitting form with the following data:`);
    console.log(data);
    // If submitted successfully, display success modal:
    openSuccessConfirmModal();
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
                  <FormControl isInvalid={!!errors.courseName}>
                    <FormLabel htmlFor="course-name">Course name:</FormLabel>
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

                  <FormControl isInvalid={!!errors.term}>
                    <FormLabel htmlFor="term">Term: </FormLabel>
                    <Input
                      id="term"
                      placeholder="Follow Format SEMESTER YEAR (Winter 2024, Fall 2023, etr)"
                      {...register('term', {
                        required: 'Term is required. Please enter the term this course is taken.',
                      })}
                    />

                    <FormErrorMessage>{errors.term && errors.term.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.sectionCode}>
                    <FormLabel htmlFor="section-code">Section Code:</FormLabel>
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

                  <FormControl isInvalid={!!errors.professor}>
                    <FormLabel htmlFor="professor">Professor:</FormLabel>
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

                        <FormControl isInvalid={!!errors.courseLoadRating}>
                          <FormLabel>Course Load:</FormLabel>
                          <RadioGroup name="courseLoadRating" id="course-load">
                            <Controller
                              name="courseLoadRating"
                              control={control}
                              rules={{ required: 'This rating is required' }}
                              render={({ field }) => {
                                return (
                                  <HStack {...courseLoadGroup} onChange={field.onChange}>
                                    {ratingOptions.map((value) => {
                                      const radio = getCourseLoadRadioProps({ value });
                                      return (
                                        <Rating
                                          key={value}
                                          {...radio}
                                          id={`courseLoadRating-${value}`}
                                          name={`courseLoadRating`}
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
                            {errors.courseLoadRating && errors.courseLoadRating.message}
                          </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.contentQualityRating}>
                          <FormLabel>Content Quality:</FormLabel>
                          <RadioGroup name="contentQualityRating" id="content-quality">
                            <Controller
                              name="contentQualityRating"
                              control={control}
                              rules={{ required: 'This rating is required' }}
                              render={({ field }) => {
                                return (
                                  <HStack {...contentQualityGroup} onChange={field.onChange}>
                                    {ratingOptions.map((value) => {
                                      const radio = getContentQualityRadioProps({ value });
                                      return (
                                        <Rating
                                          key={value}
                                          {...radio}
                                          id={`contentQualityRating-${value}`}
                                          name={`contentQualityRating`}
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
                            {errors.contentQualityRating && errors.contentQualityRating.message}
                          </FormErrorMessage>
                        </FormControl>
                      </Flex>

                      <Flex flex="1" direction="column" gap={5}>
                        <FormControl isInvalid={!!errors.courseStructureRating}>
                          <FormLabel>Course Structure:</FormLabel>
                          <RadioGroup name="courseStructureRating" id="course-structure">
                            <Controller
                              name="courseStructureRating"
                              control={control}
                              rules={{ required: 'This rating is required' }}
                              render={({ field }) => {
                                return (
                                  <HStack {...courseStructureGroup} onChange={field.onChange}>
                                    {ratingOptions.map((value) => {
                                      const radio = getCourseStructureRadioProps({ value });
                                      return (
                                        <Rating
                                          key={value}
                                          {...radio}
                                          id={`courseStructureRating-${value}`}
                                          name={`courseStructureRating`}
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
                            {errors.courseStructureRating && errors.courseStructureRating.message}
                          </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.evaluationFairnessRating}>
                          <FormLabel>Evaluation Fairness:</FormLabel>
                          <RadioGroup name="evaluationFairnessRating" id="evaluation-fairness">
                            <Controller
                              name="evaluationFairnessRating"
                              control={control}
                              rules={{ required: 'This rating is required' }}
                              render={({ field }) => {
                                return (
                                  <HStack {...evaluationFairnessGroup} onChange={field.onChange}>
                                    {ratingOptions.map((value) => {
                                      const radio = getEvaluationFairnessRadioProps({ value });
                                      return (
                                        <Rating
                                          key={value}
                                          {...radio}
                                          id={`evaluationFairnessRating-${value}`}
                                          name={`evaluationFairnessRating`}
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
                            {errors.courseLoadRating && errors.courseLoadRating.message}
                          </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.materialRelevanceRating}>
                          <FormLabel>Material Relevance:</FormLabel>
                          <RadioGroup name="materialRelevanceRating" id="material-relevance">
                            <Controller
                              name="materialRelevanceRating"
                              control={control}
                              rules={{ required: 'This rating is required' }}
                              render={({ field }) => {
                                return (
                                  <HStack {...materialRelevanceGroup} onChange={field.onChange}>
                                    {ratingOptions.map((value) => {
                                      const radio = getMaterialRelevanceRadioProps({ value });
                                      return (
                                        <Rating
                                          key={value}
                                          {...radio}
                                          id={`materialRelevanceRating-${value}`}
                                          name={`materialRelevanceRating`}
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
                            {errors.courseLoadRating && errors.courseLoadRating.message}
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
                    <FormControl isInvalid={!!errors.grade}>
                      <FormLabel htmlFor="grade">Grade:</FormLabel>
                      <Select id="grade" placeholder="Select grade..." {...register('grade')}>
                        <option value="a">A</option>
                        <option value="b">B</option>
                        <option value="c">C</option>
                        <option value="d">D</option>
                        <option value="f">F</option>
                      </Select>
                      <FormErrorMessage>{errors.grade && errors.grade.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.tags}>
                      <FormLabel htmlFor="tags">Tags:</FormLabel>
                      <Select id="tags" placeholder="Select tag..." {...register('tags')}>
                        <option value="html">HTML</option>
                        <option value="css">CSS</option>
                        <option value="aws">AWS</option>
                      </Select>
                      <FormErrorMessage>{errors.tags && errors.tags.message}</FormErrorMessage>
                    </FormControl>
                  </Flex>

                  {/**** Included Tags: Need to discuss how this is implemented *****/}
                </Flex>
                <Flex flex="1" direction="column" gap={10}>
                  <Flex direction="column" gap={5}>
                    <FormControl isInvalid={!!errors.difficultyReview}>
                      <FormLabel htmlFor="difficulty-review">Difficulty Review:</FormLabel>
                      <Textarea
                        id="difficulty-review"
                        placeholder="Share any difficulties or challenges you faced in this course..."
                        {...register('difficultyReview')}
                      />
                      <FormErrorMessage>{errors.tags && errors.tags.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.solution}>
                      <FormLabel htmlFor="solution">Solution:</FormLabel>
                      <Textarea
                        id="solution"
                        placeholder="How you overcame the above challenges..."
                        {...register('solution')}
                      />
                      <FormErrorMessage>{errors.tags && errors.tags.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.assessmentsReview}>
                      <FormLabel htmlFor="assessments">Assessments Review:</FormLabel>
                      <Textarea
                        id="assessments"
                        placeholder="Your review for any Assignment/Lab/Quiz/Exam in this course..."
                        {...register('assessmentsReview')}
                      />
                      <FormErrorMessage>
                        {errors.assessmentsReview && errors.assessmentsReview.message}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.references}>
                      <FormLabel htmlFor="references">References:</FormLabel>
                      <Textarea
                        id="references"
                        placeholder="Share any resources/references that helped you overcome the challenges..."
                        {...register('references')}
                      />
                      <FormErrorMessage>
                        {errors.references && errors.references.message}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.otherComment}>
                      <FormLabel htmlFor="other-comment">Other Comment:</FormLabel>
                      <Textarea
                        id="other-comment"
                        placeholder="Anything else you would like to share..."
                        {...register('otherComment')}
                      />
                      <FormErrorMessage>
                        {errors.otherComment && errors.otherComment.message}
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
        title="Discard Changes?"
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

export default CourseReviewForm;
