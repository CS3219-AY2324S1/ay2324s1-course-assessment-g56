'use client';

import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Select,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useSession } from '@/contexts/SupabaseProvider';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { ProfileData } from '@/types/profile';
import { useUpdateUserMutation } from '@/hooks/useUpdateUserMutation';
import { Language } from '@/types/language';

interface OnboardingLanguageFormProps {
  profileData: ProfileData;
  setProfileData: Dispatch<SetStateAction<ProfileData>>;
  goToNext: () => void;
  goToPrevious: () => void;
}

function OnboardingLanguageForm({
  profileData,
  setProfileData,
  goToNext,
  goToPrevious,
}: OnboardingLanguageFormProps) {
  const session = useSession();
  const toast = useToast();
  const updateUserMutation = useUpdateUserMutation(session?.user.id ?? '');

  const changeLanguage = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setProfileData(
      (prevData: ProfileData) =>
        ({
          ...prevData,
          preferredInterviewLanguage: value as Language,
        }) as ProfileData,
    );
  };

  const saveProfile = async () => {
    if (!profileData.preferredInterviewLanguage) {
      toast({
        title: 'Please fill out your preferred interview language.',
        status: 'error',
      });
      return;
    }
    await updateUserMutation
      .mutateAsync(profileData)
      .then(() => {
        goToNext();
      })
      .catch(() => {
        goToPrevious();
      });
  };

  return (
    <VStack spacing={4} minW="100%">
      <FormControl isRequired>
        <FormLabel id="preferredInterviewLanguage">
          Preferred Interview Language
        </FormLabel>
        <Select
          onChange={changeLanguage}
          required
          value={profileData.preferredInterviewLanguage ?? ''}
        >
          <option value="" disabled hidden>
            Choose Language
          </option>
          <option value={Language.JAVA}>Java</option>
          <option value={Language.JAVASCRIPT}>Javascript</option>
          <option value={Language.PYTHON_THREE}>Python 3</option>
        </Select>
      </FormControl>
      <HStack spacing={2} mt={4} w="100%">
        <Button
          colorScheme="green"
          onClick={goToPrevious}
          disabled={updateUserMutation.isPending}
        >
          Previous Step
        </Button>
        <Button
          colorScheme="green"
          onClick={saveProfile}
          isLoading={updateUserMutation.isPending}
        >
          Next Step
        </Button>
      </HStack>
    </VStack>
  );
}

export default OnboardingLanguageForm;
