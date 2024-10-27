// components/StatusIcon.tsx

import { Icon } from '@chakra-ui/react';
import { FaCheckCircle, FaTimesCircle, FaExclamationCircle } from 'react-icons/fa';

interface StatusIconProps {
  status: string;
}

// After everything gets implemented, from the admin side and user side of profile,
// this reusable componenet would be added to other pages that uses it, such as:
// ReviewsTable, User Reviews Courses, User Reviews Professors, etc...

const StatusIcon: React.FC<StatusIconProps> = ({ status }) => {
  switch (status) {
    case 'approved':
      return <Icon as={FaCheckCircle} color="green.500" boxSize="8" />;
    case 'pending':
      return <Icon as={FaExclamationCircle} color="yellow.500" boxSize="8" />;
    case 'rejected':
      return <Icon as={FaTimesCircle} color="red.500" boxSize="8" />;
    default:
      return null;
  }
};

export default StatusIcon;
