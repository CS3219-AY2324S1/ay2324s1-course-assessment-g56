import React, { ReactElement, useEffect, useContext } from 'react';

import { Button } from '@chakra-ui/react';

import NextLink from 'next/link';
import { useRoomStore } from '@/hooks/useRoomStore';

import { RoomContext } from './RoomContext';
import { supabaseAnon } from '../supabase/supabase';

const supabase = supabaseAnon;

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

  const { closeRoom } = useRoomStore((state) => ({
    closeRoom: state.closeRoom,
  }));

  useEffect(() => {
    const updateDatabase = async () => {
      // export to supabase
      const { error } = await supabase
        .from('collaborations')
        .update({
          user1_code: room1State,
          user2_code: room2State,
          is_closed: true,
        })
        .eq('room_id', basicRoomState.roomId);

      if (error) {
        console.error('Error updating database:', error);
      }
    };

    if (!isRoomOpen) {
      updateDatabase();
      closeRoom();
    }
  }, [isRoomOpen]);

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
