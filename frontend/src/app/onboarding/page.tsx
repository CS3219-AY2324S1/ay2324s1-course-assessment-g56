'use client';

import OnboardingForm from '@/components/form/OnboardingForm';
import SkeletonArray from '@/components/skeleton/SkeletonArray';
import { useUserData } from '../../hooks/useUserData';

export default function Account() {
  const { isInitialLoading } = useUserData();

  if (isInitialLoading) {
    return <SkeletonArray />;
  }

  return <OnboardingForm />;
}
