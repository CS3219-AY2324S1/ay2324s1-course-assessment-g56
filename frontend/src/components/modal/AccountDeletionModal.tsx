'use client';

import { Button, Text } from '@chakra-ui/react';
import { useRef } from 'react';
import { useSession } from '@/contexts/SupabaseProvider';
import Modal from './Modal';

function AccountDeletionModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const modalTitle =
    'Are you sure you want to permanently delete your account?';
  const finalRef = useRef(null);
  const session = useSession();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      finalRef={finalRef}
      actions={
        <>
          <form action="/auth/delete" method="post">
            <input type="hidden" name="userId" value={session?.user?.id} />
            <Button
              colorScheme="red"
              mr={3}
              isDisabled={!session}
              type="submit"
            >
              Delete account
            </Button>
          </form>
          <Button onClick={onClose}>Cancel</Button>
        </>
      }
    >
      <Text>This action is irreversible!</Text>
    </Modal>
  );
}

export default AccountDeletionModal;
