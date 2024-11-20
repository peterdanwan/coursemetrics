import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { apiFetcher } from '@/utils';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Text,
  ModalCloseButton,
  Box,
  List,
  ListItem,
  Flex,
} from '@chakra-ui/react';

import RatingIcons from './RatingIcons';

interface QnA {
  question_id: number;
  question: string;
  answer: string;
}

const ReviewDetailModal = ({
  isReviewDetailOpen,
  onReviewDetailClose,
  review,
}: {
  isReviewDetailOpen: any;
  onReviewDetailClose: any;
  review: any;
}) => {
  const [ratingQuestions, setRatingQuestions] = useState<any>(null);
  const [feedbackQuestions, setFeedbackQuestions] = useState<any>(null);

  // Fetch questions from API
  const { data: questionsResponse, error: questionsResponseError } = useSWR(
    `/api/questions?type=${review.review_type_id}`,
    apiFetcher
  );

  useEffect(() => {
    if (!isReviewDetailOpen) return;
    if (questionsResponse && questionsResponse.status === 'ok') {
      if (!review) return;

      // console.log('review');
      // console.log(review);

      // Helper function: match questions from db and answers from review
      // Returns an array of QnA objects
      const extractQnAsForUI = (reviewQuestions: any, reviewAnswers: any) => {
        const qnaForUI: QnA[] = [];

        for (let i = 0; i < reviewQuestions.length; i++) {
          for (let j = 0; j < reviewAnswers.length; j++) {
            if (reviewAnswers[j].Question.question_id === reviewQuestions[i].question_id) {
              if (reviewAnswers[j].ReviewAnswers[0].answer === '') break;
              const qna: QnA = {
                question_id: reviewAnswers[j].Question.question_id,
                question: reviewAnswers[j].Question.question_text,
                answer: reviewAnswers[j].ReviewAnswers[0].answer,
              };

              qnaForUI.push(qna);
              break;
            }
          }
        }
        return qnaForUI;
      };
      // get review answers
      const reviewQnA = review.ReviewQuestions;

      // get all questions from DB that indicate whether they're rating or feedback questions
      // by review_type_id (which review answers do not)
      const questionsFromDB = questionsResponse.data.questions;

      const ratingQuestionsFromDB = questionsFromDB.filter((q: any) => {
        return q.is_rating;
      });

      // match rating questions with answers
      const ratingQnA: QnA[] = extractQnAsForUI(ratingQuestionsFromDB, reviewQnA);
      // console.log('ratingQnA');
      // console.log(ratingQnA);
      setRatingQuestions(ratingQnA);

      // filter out feedback questions
      const feedbackQuestionsFromDB = questionsFromDB.filter((q: any) => {
        return !q.is_rating;
      });

      // match feedback questions with answers
      const feedbackQnA: QnA[] = extractQnAsForUI(feedbackQuestionsFromDB, reviewQnA);
      setFeedbackQuestions(feedbackQnA.length > 0 ? feedbackQnA : null);
    }
  }, [isReviewDetailOpen, questionsResponse, review, setRatingQuestions, setFeedbackQuestions]);

  return (
    <Modal isOpen={isReviewDetailOpen} onClose={onReviewDetailClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color="teal" pr={8}>
          {review.title}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <Text mb={4}> {review.comment}</Text>
            <Box my={4}>
              <Text as="b">Course Evaluations:</Text>
              {ratingQuestions &&
                ratingQuestions.map((q: QnA) => {
                  return (
                    <Flex key={q.question_id} my={3} gap={2} alignItems="center">
                      <Text as="i" w="180px">
                        {q.question}:{' '}
                      </Text>
                      <RatingIcons rating={q.answer} />
                    </Flex>
                  );
                })}
            </Box>
            <Box my={4}>
              {feedbackQuestions && <Text as="b">Additional Feedback:</Text>}
              {feedbackQuestions && (
                <List>
                  {feedbackQuestions.map((q: QnA) => {
                    return (
                      <ListItem key={q.question_id} my={3}>
                        <Text as="i">Q: {q.question}</Text>
                        <Text>A: {q.answer}</Text>
                      </ListItem>
                    );
                  })}
                </List>
              )}
            </Box>
            {review.review_type_id === 1 && (
              <Box mb={4}>
                <Text as="b">Professor:</Text> {review.ProfessorCourse.Professor.first_name}{' '}
                {review.ProfessorCourse.Professor.last_name}
              </Box>
            )}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ReviewDetailModal;
