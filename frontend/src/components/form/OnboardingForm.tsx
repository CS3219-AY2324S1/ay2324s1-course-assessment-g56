'use client';

import {
  Box,
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useUserData } from '@/hooks/useUserData';
import { ProfileData } from '@/types/profile';
import LanguageForm from './LanguageForm';
import ProfileForm from './ProfileForm';
import OnboardingSuccessCard from '../card/OnboardingSuccessCard';

const steps = [
  { title: 'Account Info' },
  { title: 'Preferences' },
  { title: 'Start Matching!' },
];

function OnboardingForm() {
  const { activeStep, goToNext, goToPrevious } = useSteps({
    index: 1,
    count: steps.length,
  });

  const { data } = useUserData();

  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: null,
    username: null,
    website: null,
    avatarUrl: null,
    preferredInterviewLanguage: null,
    role: 'User',
    updatedAt: null,
  });

  useEffect(() => {
    if (data) {
      setProfileData(data);
    }
  }, [data]);

  const stepContent = [
    <ProfileForm
      profileData={profileData}
      setProfileData={setProfileData}
      goToNext={goToNext}
    />,
    <LanguageForm
      profileData={profileData}
      setProfileData={setProfileData}
      goToPrevious={goToPrevious}
      goToNext={goToNext}
    />,
    <OnboardingSuccessCard />,
  ];

  return (
    <>
      <Stepper index={activeStep} pb={8}>
        {steps.map((step) => (
          <Step key={`${step}`}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>

            <Box flexShrink="0">
              <StepTitle>{step.title}</StepTitle>
            </Box>

            <StepSeparator />
          </Step>
        ))}
      </Stepper>
      {stepContent[activeStep - 1]}
    </>
  );
}

export default OnboardingForm;
