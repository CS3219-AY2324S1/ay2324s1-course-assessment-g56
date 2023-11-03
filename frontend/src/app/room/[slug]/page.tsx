'use client';

import { useSession } from '@/contexts/SupabaseProvider';
import { useUserData } from '@/hooks/useUserData';
import EditQuestionForm from '@/components/form/EditQuestionForm';
import QuestionCard from '@/components/card/QuestionCard';
import SkeletonArray from '@/components/skeleton/SkeletonArray';

function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const session = useSession();
  const { data: user, isLoading } = useUserData();

  if (isLoading) {
    return <SkeletonArray />;
  }

  if (user?.role === 'Maintainer') {
    return (
      <EditQuestionForm
        slug={slug}
        access_token={session?.access_token ?? ''}
      />
    );
  }
  return (
    <QuestionCard slug={slug} access_token={session?.access_token ?? ''} />
  );
}

export default Page;
