import React, { ReactElement, useEffect, useContext } from 'react';

import { Button } from '@chakra-ui/react';

import { RoomContext } from './RoomContext';

// import { EditorState } from '@codemirror/state';

// interface CloseRoomButtonProps {
//   isRoomOpen: boolean;
//   setIsRoomOpen: () => void;
//   room1State: EditorState;
//   room2State: EditorState;
// }

export default function CloseRoomButton(): ReactElement {
  const {
    isRoomOpen,
    setIsRoomOpen,
    room1State,
    // setRoom1State,
    room2State,
    // setRoom2State,
  } = useContext(RoomContext);

  useEffect(() => {
    if (room1State && room2State) {
      console.log('room1State and room2State are not null');
      console.log(room1State);
      console.log(room2State);
    }
  }, [isRoomOpen, room1State, room2State]);

  return (
    <Button
      colorScheme="red"
      variant="outline"
      onClick={() => {
        setIsRoomOpen(false);
        console.log('close room');
      }}
    >
      Close Room
    </Button>
  );
}
