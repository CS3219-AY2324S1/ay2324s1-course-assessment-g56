import React, { ReactElement, useEffect, useContext } from 'react';

import { Button } from '@chakra-ui/react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database.types';
import NextLink from 'next/link';

import { RoomContext } from './RoomContext';

const supabase = createClientComponentClient<Database>({
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_ANON_KEY,
});

export default function CloseRoomButton(): ReactElement {
  const {
    isRoomOpen,
    setIsRoomOpen,
    room1State,
    // setRoom1State,
    room2State,
    // setRoom2State,
    basicRoomState,
  } = useContext(RoomContext);

  useEffect(() => {
    const updateDatabase = async () => {
      console.log('room1State and room2State are not null');
      console.log(room1State);
      console.log(room2State);
      // export to supabase
      // TODO add more fields
      const { error } = await supabase
        .from('collaborations')
        .update({ user1_code: room1State, user2_code: room2State })
        .eq('room_id', basicRoomState.roomId);

      if (error) {
        console.error('Error updating database:', error);
      }
    };

    if (room1State && room2State && basicRoomState) {
      updateDatabase();
    }
  }, [isRoomOpen, room1State, room2State, basicRoomState]);

  return (
    <Button
      as={NextLink}
      href="/"
      colorScheme="red"
      variant="outline"
      onClick={() => {
        const userConfirmed = window.confirm(
          "You're about to close the room. Are you sure?",
        );
        if (userConfirmed) {
          setIsRoomOpen(false);
          console.log('close room');
        }
      }}
    >
      Close Room
    </Button>
  );
}