'use client';

import OnboardingForm from '@/components/form/OnboardingForm';
import { redirect } from 'next/navigation';
import SkeletonArray from '@/components/skeleton/SkeletonArray';
import { useUserData } from '../../hooks/useUserData';

export default function Account() {
  const { data, isLoading } = useUserData();

  if (data?.updatedAt) {
    redirect('/account');
  }

  if (isLoading) {
    return <SkeletonArray />;
  }

  return <OnboardingForm />;
}
