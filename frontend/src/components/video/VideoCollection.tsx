/* eslint-disable jsx-a11y/interactive-supports-focus */
import { ReactElement, useEffect, useState } from 'react';
import {
  AgoraVideoPlayer,
  createClient,
  createMicrophoneAndCameraTracks,
} from 'agora-rtc-react';
import AgoraRTC, {
  ClientConfig,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from 'agora-rtc-sdk-ng';

// import Typography from 'components/typography';
// import { useUser } from 'contexts/UserContext';
// import VideoApi from 'lib/videoService';

import './VideoCollection.css';
import { FiMic, FiMicOff, FiVideo, FiVideoOff } from 'react-icons/fi';
import { HStack, IconButton, Text } from '@chakra-ui/react';
import { getVideoAccessToken } from '@/lib/video_token';

const config: ClientConfig = {
  mode: 'rtc',
  codec: 'vp8',
};

const appId = process.env.NEXT_PUBLIC_AGORA_ID ?? '';

if (process.env.NODE_ENV !== 'development') {
  AgoraRTC.setLogLevel(4);
}

const useClient = createClient(config);
const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();

function Controls(props: {
  tracks?: [IMicrophoneAudioTrack, ICameraVideoTrack];
  username: string;
}): ReactElement<'div'> {
  const { tracks, username } = props;
  const [trackState, setTrackState] = useState({ video: true, audio: true });

  const toggle = async (type: 'audio' | 'video'): Promise<void> => {
    if (!tracks) {
      return;
    }
    if (type === 'audio') {
      await tracks[0].setEnabled(!trackState.audio);
      setTrackState((ps) => ({ ...ps, audio: !ps.audio }));
    } else if (type === 'video') {
      await tracks[1].setEnabled(!trackState.video);
      setTrackState((ps) => ({ ...ps, video: !ps.video }));
    }
  };

  return (
    <HStack
      backgroundColor="rgba(0, 0, 0, 0.4)"
      bottom={0}
      justifyContent="space-between"
      minH={7}
      position="absolute"
      px={2}
      py={0.5}
      width="100%"
    >
      <Text color="white" fontSize="xs" noOfLines={1}>
        {username}
      </Text>
      {tracks && (
        <HStack>
          {/* <IconButton
            aria-label="Audio"
            color="white"
            icon={trackState.audio ? <FiMic /> : <FiMicOff />}
            onClick={(): Promise<void> => toggle('audio')}
            size="xs"
          /> */}
          <IconButton
            aria-label="Video"
            color="white"
            icon={trackState.video ? <FiVideo /> : <FiVideoOff />}
            onClick={(): Promise<void> => toggle('video')}
            size="xs"
          />
        </HStack>
      )}
    </HStack>
  );
}

interface Props {
  partnerUsername: string;
  roomId: string;
}

const getToken = async (roomId: string): Promise<string> => {
  try {
    const response = await getVideoAccessToken(roomId);
    return response.token;
  } catch (error) {
    return '';
  }
};

function VideoCollection({
  partnerUsername,
  roomId,
}: Props): ReactElement<'div'> | null {
  const [inCall, setInCall] = useState(true);
  const [users, setUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [start, setStart] = useState<boolean>(false);
  const [hasInitialised, setHasInitialised] = useState<boolean>(false);
  const client = useClient();
  const { ready, tracks } = useMicrophoneAndCameraTracks();
  // const userProfile = useUser();

  useEffect(() => {
    // function to initialise the SDK
    if (!appId) {
      return;
    }

    const init = async (channelName: string): Promise<void> => {
      client.on('user-published', async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === 'video') {
          setUsers((prevUsers) => [...prevUsers, user]);
        }
        if (mediaType === 'audio') {
          user.audioTrack?.play();
        }
      });

      client.on('user-unpublished', (user, type) => {
        if (type === 'audio') {
          user.audioTrack?.stop();
        }
        if (type === 'video') {
          setUsers((prevUsers) =>
            prevUsers.filter((User) => User.uid !== user.uid),
          );
        }
      });

      client.on('user-left', (user) => {
        setUsers((prevUsers) =>
          prevUsers.filter((User) => User.uid !== user.uid),
        );
      });

      const token = await getToken(channelName);
      await client.join(appId, channelName, token, null);
      setInCall(true);
      if (tracks) {
        await client.publish([tracks[0], tracks[1]]);
      }
      setStart(true);
    };

    if (ready && tracks && !hasInitialised) {
      setHasInitialised(true);
      init(roomId);
    }
  }, [roomId, client, ready, tracks, hasInitialised]);

  // if (!client || !userProfile) {
  //   return null;
  // }

  return (
    <div className="video-call-container">
      {inCall && start && tracks && (
        <>
          <div className="video-panel">
            <AgoraVideoPlayer className="video" videoTrack={tracks[1]} />
            <Controls tracks={tracks} username="cheng yi" />
          </div>
          {users.length > 0 && users[0].videoTrack ? (
            <div className="video-panel">
              <AgoraVideoPlayer
                className="video"
                videoTrack={users[0].videoTrack}
              />
              <Controls username={partnerUsername} />
            </div>
          ) : (
            <div className="video-panel">
              <Controls username={partnerUsername} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default VideoCollection;
