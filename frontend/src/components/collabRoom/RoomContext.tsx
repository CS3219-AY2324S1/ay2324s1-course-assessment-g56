import React, { useState, useMemo } from 'react';
import { EditorState } from '@codemirror/state';

export const RoomContext = React.createContext<RoomContextType>({
  isRoomOpen: false,
  setIsRoomOpen: () => {},
  room1State: undefined,
  setRoom1State: () => {},
  room2State: undefined,
  setRoom2State: () => {},
});

// eslint-disable-next-line react/prop-types
export function RoomProvider({ children }) {
  const [isRoomOpen, setIsRoomOpen] = useState(true);
  const [room1State, setRoom1State] = useState<EditorState>();
  const [room2State, setRoom2State] = useState<EditorState>();

  return (
    <RoomContext.Provider
      value={useMemo(
        () => ({
          isRoomOpen,
          setIsRoomOpen,
          room1State,
          setRoom1State,
          room2State,
          setRoom2State,
        }),
        [isRoomOpen, room1State, room2State],
      )}
    >
      {children}
    </RoomContext.Provider>
  );
}

export type RoomContextType = {
  isRoomOpen: boolean;
  setIsRoomOpen: React.Dispatch<React.SetStateAction<boolean>>;
  room1State: EditorState | undefined;
  setRoom1State: React.Dispatch<React.SetStateAction<EditorState | undefined>>;
  room2State: EditorState | undefined;
  setRoom2State: React.Dispatch<React.SetStateAction<EditorState | undefined>>;
};
