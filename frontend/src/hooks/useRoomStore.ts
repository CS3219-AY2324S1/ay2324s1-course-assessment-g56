import { Language } from '@/types/language';
import { create } from 'zustand';

type RoomState = {
  userIsInterviewer: boolean;
  questionSlug: string;
  languageSlug: Language;
  isClosed: boolean;
  codeResult: JSON;
};

type RoomAction = {
  changeInterviewer: () => void;
  setQuestionSlug: (slug: string) => void;
  setLanguageSlug: (slug: Language) => void;
  closeRoom: () => void;
  setCodeResult: (result: JSON) => void;
};

export const useRoomStore = create<RoomState & RoomAction>((set) => ({
  userIsInterviewer: false,
  questionSlug: '',
  languageSlug: Language.PYTHON_THREE,
  isClosed: false,
  codeResult: null,
  changeInterviewer: () =>
    set((state) => ({ userIsInterviewer: !state.userIsInterviewer })),
  setQuestionSlug: (slug) => set({ questionSlug: slug }),
  setLanguageSlug: (slug) => set({ languageSlug: slug }),
  closeRoom: () => set({ isClosed: true }),
  setCodeResult: (result) => set({ codeResult: result }),
}));
