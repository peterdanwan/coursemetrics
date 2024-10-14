import { Icon } from '@chakra-ui/react';
import { FaCheckCircle, FaExclamationCircle, FaTimesCircle } from 'react-icons/fa';

type StatusIconProps = {
  status: 'approved' | 'pending' | 'rejected';
};

const ReviewsStatusIcon: React.FC<StatusIconProps> = ({ status }) => {
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

export default ReviewsStatusIcon;
