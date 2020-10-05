import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import utils from '../../utils';
import api from '../../api';
import ActressProfile from '../../components/ActressProfile';
import Error from '../../components/Error';
import Aliases from '../../components/Aliases';
import Videos from '../../components/Videos';

const VIDEOS_PER_PAGE = 24;

const videosByActress = {};

export default () => {
  const query = utils.useQuery();
  const actress = query.get('actress');
  const videosOfActress = React.useMemo(() => {
    if (videosByActress[actress.toLowerCase()] === undefined) {
      videosByActress[actress.toLowerCase()] = {};
    }
    return videosByActress[actress.toLowerCase()];
  }, [actress]);

  const videosBuffer = React.useRef(utils.sortVideos(videosOfActress));
  const [videosRendered, setVideosRendered] = React.useState([]);
  const loading = React.useRef(false);

  const actressProfile = React.useMemo(() => (
    <Grid container justify="center">
      <ActressProfile actress={actress} />
    </Grid>
  ), [actress]);
  const aliases = React.useMemo(() => <Aliases actress={actress} />, [actress]);
  const videos = React.useMemo(() => {
    if (loading.current) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
          <CircularProgress color="secondary" />
        </div>
      );
    }
    if (videosByActress[actress.toLowerCase()] === null) {
      return <Error />;
    }
    return <Videos videos={videosRendered} />;
  }, [actress, videosRendered]);

  const nextPage = React.useCallback(() => {
    setVideosRendered((vr) => videosBuffer.current.slice(0, vr.length + VIDEOS_PER_PAGE));
  }, []);

  React.useEffect(() => {
    setVideosRendered([]);
  }, [actress]);

  React.useEffect(() => {
    if (loading.current) {
      return;
    }
    loading.current = true;
    api.ws.searchByActress({ actress }).onArrival((rsp) => {
      rsp.forEach((video) => {
        if (!videosOfActress[video.code]) {
          videosOfActress[video.code] = video;
        } else {
          videosOfActress[video.code] = utils.mergeVideos(videosOfActress[video.code], video);
        }
      });
      videosBuffer.current = utils.sortVideos(videosOfActress);
      if (loading.current) {
        loading.current = false;
        nextPage();
      }
    }).onError(() => {
      videosByActress[actress.toLowerCase()] = null;
      loading.current = false;
    });
  }, [actress, nextPage, videosOfActress]);

  React.useEffect(() => {
    window.onwheel = () => {
      if (utils.onBottom()) {
        nextPage();
      }
    };

    return () => {
      window.onwheel = null;
    };
  }, [nextPage]);

  return (
    <>
      {actressProfile}
      {aliases}
      {videos}
    </>
  );
};
