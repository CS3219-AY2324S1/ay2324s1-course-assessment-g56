import { create } from 'zustand';

type RoomState = {
  userIsInterviewer: boolean;
  questionSlug: string;
};

type RoomAction = {
  changeInterviewer: () => void;
  setQuestionSlug: (slug: string) => void;
};

export const useRoomStore = create<RoomState & RoomAction>((set) => ({
  userIsInterviewer: false,
  questionSlug: '',
  changeInterviewer: () =>
    set((state) => ({ userIsInterviewer: !state.userIsInterviewer })),
  setQuestionSlug: (slug) => set({ questionSlug: slug }),
}));
