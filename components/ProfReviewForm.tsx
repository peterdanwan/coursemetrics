import { useForm, SubmitHandler, FieldValues, Controller, useFieldArray } from 'react-hook-form';
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
  Spinner,
  Textarea,
} from '@chakra-ui/react';

import RatingScale from './RatingScale';
import ConfirmationModal from './ConfirmationModal';
import { apiFetcher } from '@/utils';
import useSWR from 'swr';

type QuestionUI = {
  question_id: string;
  question_text: string;
  is_rating: boolean;
  answer: string;
};

export interface FormValues extends FieldValues {
  courseName: string;
  term: string;
  sectionCode: string;
  professor: string;
  questions: QuestionUI[];
  takeAgain: boolean;
  commentTitle: string;
  comment: string;
}

let defaultFormVal: FormValues = {
  courseName: '',
  term: '',
  sectionCode: '',
  professor: '',
  questions: [],
  takeAgain: false,
  commentTitle: '',
  comment: '',
};

interface ReviewFormProps {
  isOpen: boolean;
  onClose: () => void;
  profReviews: any;
  professor?: any;
  professorCourses: any;
  uniqueCourseCodes?: any;
}

const ProfReviewForm: React.FC<ReviewFormProps> = ({
  isOpen,
  onClose,
  profReviews,
  professor,
  professorCourses,
  uniqueCourseCodes,
}) => {
  if (professor)
    defaultFormVal = {
      ...defaultFormVal,
      professor: `${professor.first_name} ${professor.last_name}`,
    };
  const {
    watch,
    reset,
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: defaultFormVal,
  });

  const [courses, setCourses] = React.useState<any>(null);
  const [selectedCourses, setSelectedCourses] = React.useState<any>(null);
  const [courseCodes, setCourseCodes] = React.useState<any>(null);
  const [courseSections, setCourseSections] = React.useState<any>(null);
  const [courseTerms, setCourseTerms] = React.useState<any>(null);
  const [profReviewQuestions, setProfReviewQuestions] = React.useState<any>(null);
  const [confirmModalProps, setConfirmModalProps] = React.useState<any>({
    title: '',
    message: '',
    confirmBtnText: '',
  });
  // To access "questions" fields in form
  const { fields } = useFieldArray({ name: 'questions', control });

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
    if (!isOpen) {
      // console.log('Form closed');
      // onReset();
      reset(defaultFormVal);
      return;
    }

    // courses taught by the professor
    const coursesFromDB = professorCourses.map((profCourse: any) => profCourse.Course);
    setCourses(coursesFromDB);

    for (const prop in defaultFormVal) {
      setValue(prop as string, defaultFormVal[prop as keyof FormValues]);
    }

    const uniqueCourseCodes = Array.from(
      new Set(coursesFromDB.map((course: any) => course.course_code))
    );
    setCourseCodes(uniqueCourseCodes);
  }, [isOpen, reset, professorCourses, setValue]);

  const selectedCourse = watch('courseName');

  // Filter term based on the selected course
  useEffect(() => {
    if (!selectedCourse.length) return;

    const updatedCourses = courses?.filter((course: any) => course.course_code === selectedCourse);
    setSelectedCourses(updatedCourses);

    const uniqueTerms = Array.from(
      new Set(
        updatedCourses.map((course: any) => `${course.CourseTerm.season} ${course.CourseTerm.year}`)
      )
    );
    setCourseTerms(uniqueTerms);

    // get current values of all fields
    const currValues = getValues();
    reset({ ...currValues, term: '', sectionCode: '' });
  }, [selectedCourse, courses, setSelectedCourses, setCourseTerms, reset, getValues]);

  const selectedTerm = watch('term');
  useEffect(() => {
    if (!selectedTerm.length) return;

    const [selectedSeason, selectedYear] = selectedTerm.split(' ');
    const updatedCoursesByTerm = selectedCourses?.filter((course: any) => {
      return (
        course.CourseTerm.season === selectedSeason &&
        course.CourseTerm.year === parseInt(selectedYear)
      );
    });

    let sectionCodes: any = [];
    if (updatedCoursesByTerm.length > 0) {
      sectionCodes = updatedCoursesByTerm.map((course: any) => {
        return course.course_section;
      });

      setCourseSections(sectionCodes);

      // get current values of all fields
      const currValues = getValues();
      reset({ ...currValues, sectionCode: '' });
    }
  }, [selectedTerm, selectedCourses, setCourseSections, reset, getValues]);

  const { data: profReviewQuestionsResponse, error: profReviewQuestionsResponseError } = useSWR(
    `/api/questions?type=2`,
    apiFetcher
  );

  useEffect(() => {
    if (profReviewQuestionsResponse && profReviewQuestionsResponse.status === 'ok') {
      const profReviewQuestionsFromDB = profReviewQuestionsResponse.data.questions;
      setProfReviewQuestions(profReviewQuestionsFromDB);

      // dynamically set questions from DB and default values to form by
      // populating questions from DB to an array of questionUI objects "questionsUI":
      const questionsUI: QuestionUI[] = profReviewQuestionsFromDB.map((profReviewQuestion: any) => {
        const questionUI: QuestionUI = {
          question_id: profReviewQuestion.question_id.toString(),
          question_text: profReviewQuestion.question_text,
          is_rating: profReviewQuestion.is_rating,
          answer: '',
        };
        return questionUI;
      });

      // update "questions" from default form values with "questionsUI"
      // to reflect on form UI
      const updatedDefaultFormVal: FormValues = {
        ...defaultFormVal,
        // courseName: courseName,
        questions: questionsUI,
      };

      for (const prop in updatedDefaultFormVal) {
        setValue(prop as string, updatedDefaultFormVal[prop as keyof FormValues]);
      }
    }
  }, [profReviewQuestionsResponse, profReviewQuestions, setValue]);

  const submitForm: SubmitHandler<FormValues> = async (data) => {
    console.log(`Submitting form with the following data:`);
    console.log(data);

    // Make a fetch call to the api to POST the professor review:
    try {
      await fetch(`/api/reviews/professors/${professor.professor_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      // If submitted successfully, display success modal:
      setConfirmModalProps({
        title: 'Review Submitted!',
        message: 'Your review has been submitted successfully.',
        confirmBtnText: 'OK',
      });
      openSuccessConfirmModal();
    } catch (error) {
      console.error('Error', { error });
      // If submission failed, display info modal:
      setConfirmModalProps({
        title: 'Review Submission Failed!',
        message: 'There is an error submitting your review. Please try again.',
        confirmBtnText: 'OK',
      });
      openSuccessConfirmModal();
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
            {profReviewQuestions ? (
              <form onSubmit={handleSubmit(submitForm)}>
                <Flex gap={10} wrap="wrap" direction={{ base: 'column', md: 'column', lg: 'row' }}>
                  <Flex flex="1" gap={5} direction="column">
                    {/**** PROFESSOR NAME ****/}
                    <FormControl isInvalid={!!errors.professor}>
                      <FormLabel htmlFor="professor">
                        Professor:{' '}
                        <Text as="span" color="teal" fontSize="sm">
                          (Required)
                        </Text>
                      </FormLabel>
                      <Select
                        id="professor"
                        defaultValue={`${professor.first_name} ${professor.last_name}` as const}
                        placeholder="Select professor from the list..."
                        {...register('professor', {
                          required: 'Professor is required. Please select from the list.',
                        })}
                      >
                        {/* should implement a more reusable way for a list of multiple profs */}
                        <option
                          defaultValue={`${professor.first_name} ${professor.last_name}` as const} // ?? here or select
                        >
                          {`${professor.first_name} ${professor.last_name}`}
                        </option>
                      </Select>

                      <FormErrorMessage>
                        {errors.professor && errors.professor.message}
                      </FormErrorMessage>
                    </FormControl>

                    {/**** COURSE (CODE) ****/}
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
                        {courseCodes?.map((courseCode: any, index: number) => (
                          <option key={index} value={courseCode}>
                            {courseCode}
                          </option>
                        ))}
                      </Select>
                      <FormErrorMessage>
                        {errors.courseName && errors.courseName.message}
                      </FormErrorMessage>
                    </FormControl>

                    {/**** TERM ****/}
                    <FormControl isInvalid={!!errors.term}>
                      <FormLabel htmlFor="term">
                        Term:{' '}
                        <Text as="span" color="teal" fontSize="sm">
                          (Required)
                        </Text>
                      </FormLabel>
                      <Select
                        id="term"
                        placeholder="Select from existing terms..."
                        {...register('term', {
                          required: 'Term is required. Please enter the term this course is taken.',
                        })}
                      >
                        {courseTerms?.map((term: any, index: number) => (
                          <option key={index} value={term}>
                            {term}
                          </option>
                        ))}
                      </Select>
                      <FormErrorMessage>{errors.term && errors.term.message}</FormErrorMessage>
                    </FormControl>

                    {/**** SECTION CODE ****/}
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
                        {courseSections?.map((sectionCode: any, index: number) => (
                          <option key={index} value={sectionCode}>
                            {sectionCode}
                          </option>
                        ))}
                      </Select>
                      <FormErrorMessage>
                        {errors.sectionCode && errors.sectionCode.message}
                      </FormErrorMessage>
                    </FormControl>

                    {/**** QUESTIONS SECTION ****/}
                    <Flex gap={5} wrap="wrap">
                      <Flex gap={5} wrap="wrap">
                        {/**** RATING QUESTIONS ****/}
                        <Flex direction="column" gap={{ base: '5', sm: '2', md: '2', lg: '2' }}>
                          {fields?.map((q: any, index: number) => {
                            if (!q.is_rating) return;
                            return (
                              <RatingScale
                                key={q.question_id}
                                index={index}
                                fieldErrors={errors.questions?.[index]?.answer}
                                question_text={q.question_text}
                                ratingName={`questions.${index}.answer`}
                                defaultValue=""
                                control={control}
                                question_id={q.question_id}
                              />
                            );
                          })}
                        </Flex>

                        <Flex
                          flex="1"
                          direction="column"
                          gap={{ base: '5', sm: '2', md: '2', lg: '2' }}
                        >
                          <FormControl
                            isInvalid={!!errors.takeAgain}
                            h={{ base: 'auto', sm: '106.5px', md: '106.5px', lg: '106.5px' }}
                          >
                            <FormLabel whiteSpace="nowrap">
                              Would Take Again:{' '}
                              <Text as="span" color="teal" fontSize="sm">
                                (Required)
                              </Text>
                            </FormLabel>
                            <RadioGroup defaultValue="" name="takeAgain">
                              <Stack direction="row" spacing={4}>
                                <Radio
                                  value="yes"
                                  id="takeAgain-yes"
                                  {...register('takeAgain', {
                                    required: 'Please indicate if you would take this course again',
                                  })}
                                >
                                  Yes
                                </Radio>
                                <Radio
                                  value="no"
                                  id="takeAgain-no"
                                  {...register('takeAgain', {
                                    required: 'Please indicate if you would take this course again',
                                  })}
                                >
                                  No
                                </Radio>
                              </Stack>
                            </RadioGroup>
                            <FormErrorMessage>
                              {errors.takeAgain && errors.takeAgain.message}
                            </FormErrorMessage>
                          </FormControl>
                        </Flex>
                      </Flex>
                    </Flex>
                  </Flex>

                  <Flex flex="1" direction="column" gap={10}>
                    <Flex direction="column" gap={5}>
                      {/**** COMMENT TITLE ****/}
                      <FormControl isInvalid={!!errors.commentTitle}>
                        <FormLabel htmlFor="comment-title">
                          Title:{' '}
                          <Text as="span" color="teal" fontSize="sm">
                            (Required)
                          </Text>
                        </FormLabel>
                        <Input
                          id="comment-title"
                          placeholder="Title"
                          {...register('commentTitle', {
                            required: 'Title is required.',
                          })}
                        />
                        <FormErrorMessage>
                          {errors.commentTitle && errors.commentTitle.message}
                        </FormErrorMessage>
                      </FormControl>

                      {/**** COMMENT ****/}
                      <FormControl isInvalid={!!errors.comment}>
                        <FormLabel htmlFor="comment">
                          Comment:{' '}
                          <Text as="span" color="teal" fontSize="sm">
                            (Required)
                          </Text>
                        </FormLabel>
                        <Textarea
                          id="comment"
                          placeholder="Anything about this course you would like to share..."
                          {...register('comment', {
                            required: 'Comment is required.',
                          })}
                        />
                        <FormErrorMessage>
                          {errors.comment && errors.comment.message}
                        </FormErrorMessage>
                      </FormControl>

                      {/**** REVIEW QUESTIONS ****/}
                      {fields?.map((q: any, index: number) => {
                        if (q.is_rating) return;
                        return (
                          <FormControl key={index}>
                            <FormLabel htmlFor={`questions.${index}.answer`}>
                              {q.question_text}{' '}
                              <Text as="span" color="teal" fontSize="sm">
                                (Optional)
                              </Text>
                            </FormLabel>
                            <Textarea
                              id={`questions.${index}.answer`}
                              {...register(`questions.${index}.answer`)}
                            />
                          </FormControl>
                        );
                      })}
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
            ) : (
              <Spinner />
            )}
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
        title={confirmModalProps.title}
        message={confirmModalProps.message}
        confirmBtnText={confirmModalProps.confirmBtnText}
      />
    </>
  );
};

export default ProfReviewForm;
