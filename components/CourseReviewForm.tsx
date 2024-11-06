import { useForm, SubmitHandler, FieldValues, useFieldArray } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
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
  RadioGroup,
  Stack,
  Flex,
  useDisclosure,
  Text,
  Radio,
  Textarea,
  Spinner,
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
  grade: string;
  commentTitle: string;
  comment: string;
}

const defaultFormVal: FormValues = {
  courseName: '',
  term: '',
  sectionCode: '',
  professor: '',
  questions: [],
  takeAgain: false,
  grade: '',
  commentTitle: '',
  comment: '',
};

interface CourseReviewFormProps {
  isOpen: boolean;
  onClose: () => void;
  courseResponse: any;
  reviewResponse: any;
}

const CourseReviewForm: React.FC<CourseReviewFormProps> = ({ isOpen, onClose, courseResponse }) => {
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

  // console.log('courseResponse');
  // console.log(courseResponse);

  // Course name passed from course page
  const courseName = courseResponse?.data.courses[0].course_code;

  // get current values of all fields
  const currValues = getValues();

  // To access "questions" fields in form
  const { fields } = useFieldArray({ name: 'questions', control });

  // const [courseName, setCourseName] = useState<string>("");
  const [courses, setCourses] = useState<any>([]);
  const [courseProfessors, setCourseProfessors] = useState<any>(null);
  const [courseQuestions, setCourseQuestions] = useState<any>(null);
  const [courseTerms, setCourseTerms] = useState<any>(null);
  const [courseSectionsByTerm, setCourseSectionsByTerm] = useState<any>(null);
  const [coursesByTerm, setCoursesByTerm] = useState<any>([]);

  // Track the selected value of Term and Section Codes
  const selectedTerm = watch('term');
  const selectedSectionCode = watch('sectionCode');

  // Fetch data from API
  const { data: courseProfessorResponse, error: courseProfessorResponseError } = useSWR(
    `/api/professors/course/${courseResponse?.data.courses[0].course_code}`,
    apiFetcher
  );

  const { data: courseQuestionsResponse, error: courseQuestionsResponseError } = useSWR(
    `/api/questions?type=1`,
    apiFetcher
  );

  // Courses
  useEffect(() => {
    if (courseResponse && courseResponse.status === 'ok') {
      const coursesFromDB = courseResponse.data.courses;
      setCourses(coursesFromDB);
      const uniqueTerms = Array.from(
        new Set(
          coursesFromDB.map(
            (course: any) => `${course.CourseTerm.season} ${course.CourseTerm.year}`
          )
        )
      );
      setCourseTerms(uniqueTerms);
    }
  }, [courseResponse]);

  // Filter courses by selected term
  useEffect(() => {
    if (!selectedTerm.length) return;

    const [selectedSeason, selectedYear] = selectedTerm.split(' ');
    const updatedCoursesByTerm = courses?.filter((course: any) => {
      return (
        course.CourseTerm.season === selectedSeason &&
        course.CourseTerm.year === parseInt(selectedYear)
      );
    });

    if (updatedCoursesByTerm.length > 0) {
      const sectionCodes = updatedCoursesByTerm.map((course: any) => {
        return course.course_section;
      });
      setCourseSectionsByTerm(sectionCodes);
      setCoursesByTerm(updatedCoursesByTerm);
      setCourseProfessors([]);
      reset({ ...currValues, sectionCode: '', professor: '' });
    }
  }, [
    selectedTerm,
    courses,
    setCourseSectionsByTerm,
    setCoursesByTerm,
    setCourseProfessors,
    reset,
    currValues,
  ]);

  // filter courses by selected section code
  useEffect(() => {
    if (!selectedSectionCode.length) return;

    const updatedCoursesBySection = coursesByTerm?.filter((course: any) => {
      return course.course_section === selectedSectionCode;
    });

    // update professor options by course section
    if (updatedCoursesBySection.length > 0) {
      if (courseProfessorResponse && courseProfessorResponse.status === 'ok') {
        const courseProfessorsFromDB = courseProfessorResponse.data.professors;

        const uniqueProfs = courseProfessorsFromDB
          .filter((prof: any) =>
            prof.ProfessorCourses.some(
              (course: any) => course.course_id === updatedCoursesBySection[0].course_id
            )
          )
          .map((prof: any) => `${prof.first_name} ${prof.last_name}`);

        setCourseProfessors(uniqueProfs);
        reset({ ...currValues, professor: '' });
      }
    }
  }, [
    selectedSectionCode,
    coursesByTerm,
    courseProfessorResponse,
    setCourseProfessors,
    reset,
    currValues,
  ]);

  useEffect(() => {
    if (courseQuestionsResponse && courseQuestionsResponse.status === 'ok') {
      const courseQuestionsFromDB = courseQuestionsResponse.data.questions;
      setCourseQuestions(courseQuestionsFromDB);

      // dynamically set questions from DB and default values to form by
      // populating questions from DB to an array of questionUI objects "questionsUI":
      const questionsUI: QuestionUI[] = courseQuestionsFromDB.map((courseQuestion: any) => {
        const questionUI: QuestionUI = {
          question_id: courseQuestion.question_id.toString(),
          question_text: courseQuestion.question_text,
          is_rating: courseQuestion.is_rating,
          answer: '',
        };
        return questionUI;
      });

      // update "questions" from default form values with "questionsUI"
      // to reflect on form UI
      const updatedDefaultFormVal: FormValues = {
        ...defaultFormVal,
        courseName: courseName,
        questions: questionsUI,
      };

      for (const prop in updatedDefaultFormVal) {
        setValue(prop as string, updatedDefaultFormVal[prop as keyof FormValues]);
      }
    }
  }, [courseQuestionsResponse, courseQuestions, courseName, setValue]);

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
      reset(defaultFormVal);
      return;
    }
  }, [isOpen, reset]);

  const submitForm: SubmitHandler<FormValues> = async (data) => {
    console.log(`Submitting form with the following data:`);
    console.log(data);

    try {
      await fetch(`/api/reviews/courses`, {
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
        <ModalContent overflow="scroll">
          <ModalHeader color="teal" fontSize={{ base: '24', sm: '30', md: '30', lg: '36' }}>
            New Review
          </ModalHeader>
          <ModalCloseButton color="black" bgColor="gray.200" m={2} />
          <ModalBody color="black">
            {courseQuestions ? (
              <form onSubmit={handleSubmit(submitForm)}>
                <Flex
                  gap={{ base: '5', sm: '2', md: '2', lg: '10' }}
                  wrap="wrap"
                  direction={{ base: 'column', md: 'column', lg: 'row' }}
                >
                  <Flex flex="1" gap={5} direction="column">
                    {/**** COURSE NAME ****/}
                    <FormControl isInvalid={!!errors.courseName}>
                      <FormLabel htmlFor="course-name">
                        Course Name:{' '}
                        <Text as="span" color="teal" fontSize="sm">
                          (Required)
                        </Text>
                      </FormLabel>
                      <Input
                        id="course-name"
                        type="text"
                        placeholder={courseName || 'Select course from the list...'}
                        value={courseName || ''}
                        readOnly
                        disabled
                        {...register('courseName', {
                          required: 'Course name is required. Please select from the list.',
                        })}
                      />
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
                        {courseTerms.map((term: any, index: number) => (
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
                        {courseSectionsByTerm?.map((sectionCode: any, index: number) => (
                          <option key={index} value={sectionCode}>
                            {sectionCode}
                          </option>
                        ))}
                      </Select>
                      <FormErrorMessage>
                        {errors.sectionCode && errors.sectionCode.message}
                      </FormErrorMessage>
                    </FormControl>

                    {/**** PROFESSOR ****/}
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
                        {courseProfessors?.map((courseProfessor: any, index: number) => (
                          <option key={index} value={courseProfessor}>
                            {courseProfessor}
                          </option>
                        ))}
                      </Select>
                      <FormErrorMessage>
                        {errors.professor && errors.professor.message}
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
                              />
                            );
                          })}
                        </Flex>
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
                        <FormControl
                          isInvalid={!!errors.grade}
                          h={{ base: 'auto', sm: '106.5px', md: '106.5px', lg: '106.5px' }}
                        >
                          <FormLabel htmlFor="grade">
                            Grade:{' '}
                            <Text as="span" color="teal" fontSize="sm">
                              (Optional)
                            </Text>
                          </FormLabel>
                          <Select id="grade" placeholder="Select grade..." {...register('grade')}>
                            {/* Ref Doc: https://www.senecapolytechnic.ca/about/policies/grading-policy.html */}
                            <option value="A+">A+</option>
                            <option value="A">A</option>
                            <option value="B+">B+</option>
                            <option value="B">B</option>
                            <option value="C+">C+</option>
                            <option value="C">C</option>
                            <option value="D+">D+</option>
                            <option value="D">D</option>
                            <option value="F">F</option>
                            <option value="DNC">DNC</option>
                          </Select>
                          {/* <FormErrorMessage>
                              {errors.grade && errors.grade.message}
                            </FormErrorMessage> */}
                        </FormControl>
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
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        closeFormModal={onClose}
        closeConfirmModal={closeConfirmModal}
        isWarning={true}
        title="Discard Changes"
        message="Are you sure you want
            to discard all changes?"
        confirmBtnText="Yes"
      />
      <ConfirmationModal
        isOpen={isSuccessConfirmModalOpen}
        closeFormModal={onClose}
        closeConfirmModal={closeSuccessConfirmModal}
        isWarning={false}
        title="Review Submitted!"
        message="Thank you! Your review has been submitted successfully."
        confirmBtnText="OK"
      />
    </>
  );
};

export default CourseReviewForm;
