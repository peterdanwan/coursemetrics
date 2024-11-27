import React from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Text,
  ModalFooter,
} from '@chakra-ui/react';
import { useFlexStyle } from '@/styles/styles';

interface ConfirmationModalProps {
  isOpen: boolean;
  closeFormModal: () => void;
  closeConfirmModal: () => void;
  isWarning?: boolean;
  title: string;
  message?: string;
  confirmBtnText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  closeFormModal,
  closeConfirmModal,
  isWarning,
  title,
  message,
  confirmBtnText,
}) => {
  const flexStyle = useFlexStyle();

  const confirmCloseAndReset = () => {
    closeConfirmModal();
    closeFormModal();
    if (!isWarning) {
      window.location.reload();
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={closeConfirmModal} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color={isWarning ? 'red' : 'teal'}>{title}</ModalHeader>
        <ModalBody color={flexStyle.color}>
          <Text>{message}</Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme={isWarning ? 'red' : 'teal'} onClick={confirmCloseAndReset}>
            {confirmBtnText}
          </Button>
          {isWarning && (
            <Button onClick={closeConfirmModal} ml={3}>
              Go Back
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;
