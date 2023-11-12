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
import OnboardingLanguageForm from './OnboardingLanguageForm';
import OnboardingProfileForm from './OnboardingProfileForm';
import OnboardingSuccessCard from '../card/OnboardingSuccessCard';

const steps = [
  { title: 'Account Info' },
  { title: 'Preferences' },
  { title: 'Complete Registration' },
];

function OnboardingForm() {
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

  const accountInfoFilled = data?.fullName && data?.username;

  const { activeStep, goToNext, goToPrevious } = useSteps({
    index: accountInfoFilled ? 2 : 1,
    count: steps.length,
  });

  const stepContent = [
    <OnboardingProfileForm
      profileData={profileData}
      setProfileData={setProfileData}
      goToNext={goToNext}
    />,
    <OnboardingLanguageForm
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
