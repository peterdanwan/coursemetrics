// components/ReviewsStatusIcon.tsx
'use client';
import { Icon } from '@chakra-ui/react';
import { FaCheckCircle, FaExclamationCircle, FaTimesCircle } from 'react-icons/fa';

type StatusIconProps = {
  status: number; // Expecting a numeric status ID directly
};

const ReviewsStatusIcon: React.FC<StatusIconProps> = ({ status }) => {
  // Map numeric status ID to string status
  const statusMap: Record<number, 'approved' | 'pending' | 'rejected'> = {
    1: 'pending',
    2: 'approved',
    3: 'rejected',
  };

  const statusString = statusMap[status] || ''; // Default to '' if the status is invalid

  switch (statusString) {
    case 'approved':
      return <Icon as={FaCheckCircle} color="green.500" boxSize="8" />;
    case 'pending':
      return <Icon as={FaExclamationCircle} color="yellow.500" boxSize="8" />;
    case 'rejected':
      return <Icon as={FaTimesCircle} color="red.500" boxSize="8" />;
    default:
      return null; // Return null if status is invalid or empty
  }
};

export default ReviewsStatusIcon;
