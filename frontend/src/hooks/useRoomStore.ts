import { create } from 'zustand';

type RoomState = {
  userIsInterviewer: boolean;
};

type RoomAction = {
  changeInterviewer: () => void;
};

export const useRoomStore = create<RoomState & RoomAction>((set) => ({
  userIsInterviewer: false,
  changeInterviewer: () =>
    set((state) => ({ userIsInterviewer: !state.userIsInterviewer })),
}));
