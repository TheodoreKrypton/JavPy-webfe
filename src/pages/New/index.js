import React from 'react';
import Videos from '../../components/Videos';
import utils from '../../utils';
import api from '../../api';

const VIDEOS_PER_PAGE = 24;

export default () => {
  const videos = React.useRef({});
  const page = React.useRef(0);
  const videosBuffer = React.useRef([]);
  const [videosRendered, setVideosRendered] = React.useState([]);
  const loading = React.useRef(false);

  const nextPage = React.useCallback((videosCnt) => {
    if (loading.current) {
      return;
    }
    if (videosBuffer.current.length < videosCnt + VIDEOS_PER_PAGE) {
      loading.current = true;
      page.current += 1;
      api.ws.getNewlyReleased({ page: page.current }).onArrival((rsp) => {
        rsp.forEach((video) => {
          if (videos.current[video.code] === undefined) {
            videos.current[video.code] = video;
          } else {
            videos.current[video.code] = utils.mergeVideos(videos.current[video.code], video);
          }
        });
        const sortedVideos = utils.sortVideos(videos.current);
        if (loading.current) {
          setVideosRendered((vr) => sortedVideos.slice(0, vr.length + VIDEOS_PER_PAGE));
          loading.current = false;
        }
        videosBuffer.current = sortedVideos;
      });
    } else {
      setVideosRendered((vr) => videosBuffer.current.slice(0, vr.length + VIDEOS_PER_PAGE));
    }
  }, []);

  React.useEffect(() => {
    window.onwheel = () => {
      if (utils.onBottom()) {
        nextPage(videosRendered.length);
      }
    };
    window.ontouchmove = window.onwheel;
    if (videosRendered.length === 0) {
      nextPage(videosRendered.length);
    }

    return () => {
      window.onwheel = null;
    };
  }, [nextPage, videosRendered.length]);

  return (
    <>
      <Videos videos={videosRendered} />
    </>
  );
};
