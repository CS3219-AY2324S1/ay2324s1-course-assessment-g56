'use client';

import {
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from '@chakra-ui/react';
import { MutableRefObject, ReactNode, useRef } from 'react';

interface ModalProps {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  initialRef?: MutableRefObject<null>;
  finalRef?: MutableRefObject<null>;
  isClosable?: boolean;
}

function Modal({
  isOpen,
  onClose,
  title,
  children,
  actions,
  initialRef,
  finalRef,
  isClosable = true,
}: ModalProps) {
  if (!initialRef) {
    initialRef = useRef(null);
  }
  if (!finalRef) {
    finalRef = useRef(null);
  }

  return (
    <ChakraModal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        {isClosable && <ModalCloseButton />}
        <ModalBody pb={6}>{children}</ModalBody>

        <ModalFooter>
          {actions || (
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
}

export default Modal;
