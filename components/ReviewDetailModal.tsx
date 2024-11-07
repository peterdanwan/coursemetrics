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
} from '@chakra-ui/react';

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
  const { data: courseQuestionsResponse, error: courseQuestionsResponseError } = useSWR(
    `/api/questions?type=1`,
    apiFetcher
  );

  useEffect(() => {
    if (!isReviewDetailOpen) return;
    if (courseQuestionsResponse && courseQuestionsResponse.status === 'ok') {
      if (!review) return;

      // Helper function
      const extractQnAsForUI = (reviewQuestions: any, reviewAnswers: any) => {
        const qnaForUI: QnA[] = [];

        for (let i = 0; i < reviewQuestions.length; i++) {
          for (let j = 0; j < reviewAnswers.length; j++) {
            if (reviewAnswers[j].question_id === reviewQuestions[i].question_id) {
              if (reviewAnswers[j].ReviewAnswers[0].answer === '') break;
              const qna: QnA = {
                question_id: reviewAnswers[j].question_id,
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

      const courseQuestionsFromDB = courseQuestionsResponse.data.questions;

      const reviewQnA = review.ReviewQuestions;

      const ratingQuestionsFromDB = courseQuestionsFromDB.filter((q: any) => {
        return q.is_rating;
      });

      const ratingQnA: QnA[] = extractQnAsForUI(ratingQuestionsFromDB, reviewQnA);

      setRatingQuestions(ratingQnA);

      const feedbackQuestionsFromDB = courseQuestionsFromDB.filter((q: any) => {
        return !q.is_rating;
      });
      const feedbackQnA: QnA[] = extractQnAsForUI(feedbackQuestionsFromDB, reviewQnA);

      setFeedbackQuestions(feedbackQnA.length > 0 ? feedbackQnA : null);
    }
  }, [
    isReviewDetailOpen,
    courseQuestionsResponse,
    review,
    setRatingQuestions,
    setFeedbackQuestions,
  ]);

  return (
    <Modal isOpen={isReviewDetailOpen} onClose={onReviewDetailClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color="teal">{review.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <Text mb={4}> {review.comment}</Text>
            <Box>
              <Box>
                <Text as="b">Would take again:</Text> {review.would_take_again ? 'Yes' : 'No'}
              </Box>
              {ratingQuestions &&
                ratingQuestions.map((q: QnA) => {
                  return (
                    <Box key={q.question_id}>
                      <Text as="b">{q.question}:</Text> {q.answer}/5
                    </Box>
                  );
                })}
            </Box>

            <Box my={4}>
              {feedbackQuestions && <Text as="b">Additional Feedback:</Text> && (
                <List>
                  {feedbackQuestions.map((q: QnA) => {
                    return (
                      <ListItem key={q.question_id} my={3}>
                        <Text as="i">Q: {q.question}:</Text>
                        <Text>A: {q.answer}</Text>
                      </ListItem>
                    );
                  })}
                </List>
              )}
            </Box>
            <Box mb={4}>
              <Text as="b">Professor:</Text> {review.ProfessorCourse.Professor.first_name}{' '}
              {review.ProfessorCourse.Professor.last_name}
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ReviewDetailModal;
