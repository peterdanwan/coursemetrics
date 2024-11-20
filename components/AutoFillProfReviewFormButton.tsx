'use client';
import React from 'react';
import { Button } from '@chakra-ui/react';
import { UseFormSetValue } from 'react-hook-form';
import { ProfReviewFormValues } from './ProfReviewForm';

interface AutoFillProfReviewFormButtonProps {
  setValue: UseFormSetValue<ProfReviewFormValues>;
  courseTerms: string[] | null;
  courseSections: string[] | null;
  courseCodes: string[] | null;
  fields: {
    question_id: string;
    question_text: string;
    is_rating: boolean;
    answer: string;
  }[];
}

const AutoFillProfReviewFormButton: React.FC<AutoFillProfReviewFormButtonProps> = ({
  setValue,
  courseTerms,
  courseSections,
  courseCodes,
  fields,
}) => {
  const generateRandomRating = (): string => {
    return Math.floor(Math.random() * 5 + 1).toString();
  };

  const generateRandomComment = (): string => {
    const comments = [
      'An exceptional professor with a deep understanding of the subject.',
      'The lectures were engaging and well-organized.',
      'Professor provided great insights and practical examples.',
      'Very approachable and supportive throughout the course.',
      'Overall, an excellent teaching experience.',
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  };

  const generateRandomTitle = (): string => {
    const titles = [
      'Inspiring Educator',
      'Knowledgeable and Supportive',
      'Engaging and Passionate',
      'Highly Experienced Professor',
      'Clear and Concise Teaching',
    ];
    return titles[Math.floor(Math.random() * titles.length)];
  };

  const handleAutoFill = (): void => {
    // Fill Term (select first available term)
    if (courseTerms?.length > 0) {
      setValue('term', courseTerms[0]);
    }

    // Fill Course Code (select first available course code)
    if (courseCodes?.length > 0) {
      setValue('courseName', courseCodes[0]);
    }

    // Fill Section (select first available section)
    if (courseSections?.length > 0) {
      setValue('sectionCode', courseSections[0]);
    }

    // Fill Rating Questions
    fields?.forEach((field, index) => {
      if (field.is_rating) {
        setValue(`questions.${index}.answer`, generateRandomRating());
      } else {
        setValue(`questions.${index}.answer`, generateRandomComment());
      }
    });

    // Fill "Would Recommend Professor"
    setValue('takeAgain', Math.random() < 0.5);

    // Fill Title and Comment
    setValue('commentTitle', generateRandomTitle());
    setValue('comment', generateRandomComment());
  };

  return (
    <Button
      onClick={handleAutoFill}
      colorScheme="teal"
      variant="outline"
      size="md"
      aria-label="Auto-fill professor review form with random data"
    >
      Fill Form Automatically
    </Button>
  );
};

export default AutoFillProfReviewFormButton;
