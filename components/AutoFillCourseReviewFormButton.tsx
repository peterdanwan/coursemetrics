// components/AutoFillCourseReviewFormButton.tsx
'use client';
import React from 'react';
import { Button } from '@chakra-ui/react';
import { UseFormSetValue } from 'react-hook-form';
import { FormValues } from './CourseReviewForm';

interface AutoFillFormButtonProps {
  setValue: UseFormSetValue<FormValues>;
  courseTerms: string[] | null;
  courseSectionsByTerm: string[] | null;
  courseProfessors: string[] | null;
  fields: {
    question_id: string;
    question_text: string;
    is_rating: boolean;
    answer: string;
  }[];
}

const AutoFillCourseReviewFormButton: React.FC<AutoFillFormButtonProps> = ({
  setValue,
  courseTerms,
  courseSectionsByTerm,
  courseProfessors,
  fields,
}) => {
  const generateRandomRating = (): string => {
    return Math.floor(Math.random() * 5 + 1).toString();
  };

  const generateRandomComment = (): string => {
    const comments = [
      'This course was very informative and well-structured.',
      'The material was challenging but rewarding.',
      'Great learning experience with practical applications.',
      'The course content was relevant to industry needs.',
      'Excellent balance of theory and practical work.',
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  };

  const generateRandomTitle = (): string => {
    const titles = [
      'Great Learning Experience',
      'Challenging but Worth It',
      'Excellent Course Structure',
      'Very Informative Course',
      'Practical and Engaging',
    ];
    return titles[Math.floor(Math.random() * titles.length)];
  };

  const handleAutoFill = (): void => {
    // Fill Term (select first available term)
    if (courseTerms?.length > 0) {
      setValue('term', courseTerms[0]);
    }

    // Fill Section Code (select first available section)
    if (courseSectionsByTerm?.length > 0) {
      setValue('sectionCode', courseSectionsByTerm[0]);
    }

    // Fill Professor (select first available professor)
    if (courseProfessors?.length > 0) {
      setValue('professor', courseProfessors[0]);
    }

    // Fill Rating Questions
    fields?.forEach((field, index) => {
      if (field.is_rating) {
        setValue(`questions.${index}.answer`, generateRandomRating());
      } else {
        setValue(`questions.${index}.answer`, generateRandomComment());
      }
    });

    console.log('Fields', fields);

    // Fill Would Take Again
    setValue('takeAgain', Math.random() < 0.5);

    // Fill Grade
    const grades = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F', 'DNC'];
    setValue('grade', grades[Math.floor(Math.random() * grades.length)]);

    // Fill Comment Title
    setValue('commentTitle', generateRandomTitle());

    // Fill Comment
    setValue('comment', generateRandomComment());
  };

  return (
    <Button
      onClick={handleAutoFill}
      colorScheme="teal"
      variant="outline"
      size="md"
      aria-label="Auto-fill course review form with random data"
    >
      Fill Form Automatically
    </Button>
  );
};

export default AutoFillCourseReviewFormButton;
