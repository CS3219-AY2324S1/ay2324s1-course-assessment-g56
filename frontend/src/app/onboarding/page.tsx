'use client';

import OnboardingForm from '@/components/form/OnboardingForm';
import { redirect } from 'next/navigation';
import { Skeleton, VStack } from '@chakra-ui/react';
import { useUserData } from '../../hooks/useUserData';

const skeletonArray = new Array(10).fill(0);

export default function Account() {
  const { data, isLoading } = useUserData();

  if (data?.updatedAt) {
    redirect('/account');
  }

  if (isLoading) {
    return (
      <VStack spacing={6} align="stretch">
        {skeletonArray.map(() => (
          <Skeleton h={10} style={{ borderRadius: '0.375rem' }} />
        ))}
      </VStack>
    );
  }

  return <OnboardingForm />;
}
