'use client';

import { useState } from 'react';
import { Select } from '@chakra-ui/react';

import { useRoomStore } from '@/hooks/useRoomStore';
import { BasicRoomData } from '@/types/collab';
import { Language } from '@/types/language';
import { useUpdateRoomLanguagesMutation } from '../../hooks/useUpdateRoomMutation';

interface LanguageSelectProps {
  username: string;
  roomData: BasicRoomData;
  selectedLanguage: Language;
}

function LanguageSelect({
  username,
  roomData,
  selectedLanguage: language,
}: LanguageSelectProps) {
  const setLanguageSlug = useRoomStore((state) => state.setLanguageSlug);

  const [selectedLanguage, setSelectedLanguage] = useState<string>(language);

  const updateRoomLanguagesMutation = useUpdateRoomLanguagesMutation(
    roomData.roomId,
  );

  const languageSlugKey =
    roomData.user1Details.username === username ? 'user1' : 'user2';

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setLanguageSlug(event.target.value as Language);
    setSelectedLanguage(event.target.value as Language);
    updateRoomLanguagesMutation.mutate({
      key: languageSlugKey,
      languageSlug: event.target.value as Language,
      result: null,
    });
  };

  return (
    <Select value={selectedLanguage} onChange={handleLanguageChange}>
      {Object.values(Language).map((lang) => (
        <option key={lang} value={lang}>
          {lang}
        </option>
      ))}
    </Select>
  );
}

export default LanguageSelect;
