import 'video-react/dist/video-react.css'; // import css
import React from 'react';
import { Player } from 'video-react';
import utils from '../../utils';
import HLSSource from './HlsSource';

export default () => {
  const videoUrl = utils.useQuery().get('video_url');
  if (videoUrl.endsWith('.m3u8')) {
    return (
      <Player playsInline>
        <HLSSource
          isVideoChild
          src={decodeURIComponent(videoUrl)}
        />
      </Player>
    );
  }
  return (
    <Player
      playsInline
      src={decodeURIComponent(videoUrl)}
    />
  );
};
