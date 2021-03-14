import React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import VideoCard from '../../components/VideoCard';
import api from '../../api';
import utils from '../../utils';
import Error from '../../components/Error';

const getVideoUrlDomain = (url) => new URL(url).hostname;

const handleVideoClick = (videoUrl) => {
  if (videoUrl.endsWith('.m3u8') || videoUrl.endsWith('.mp4')) {
    window.open(`${api.address}/#/videoplayer?video_url=${videoUrl}`);
  } else if (videoUrl.includes('hydrax.net') || videoUrl.includes('playhydrax.com')) {
    window.open(`${api.address}/#/iframe?video_url=${videoUrl}`);
  } else {
    window.open(`${api.address}/redirect_to?url=${videoUrl}`, '_blank');
  }
};

const originalBrief = {
  code: '',
  title: '',
  preview_img_url: '',
  actress: [],
  release_date: '',
};

export default () => {
  const query = utils.useQuery();
  const code = query.get('code');

  const [brief, setBrief] = React.useState(originalBrief);
  const [sources, setSources] = React.useState([]);

  React.useEffect(() => {
    api.ws.getBrief({ code }).onArrival((av) => {
      setBrief((av0) => utils.mergeVideos(av0, av));
    });

    api.ws.searchByCode({ code }).onArrival((rsp) => {
      if (rsp) {
        setBrief((av0) => utils.mergeVideos(av0, rsp));
        setSources((s) => {
          const srcLower = s.map((url) => url.toLowerCase());
          if (srcLower.indexOf(rsp.video_url.toLowerCase()) !== -1) {
            return s;
          }
          return [...s, rsp.video_url];
        });
      }
    }).onError((reason) => {
      if (reason === 'not found') {
        setSources(null);
      }
    });
  }, [code]);

  React.useEffect(() => {
    setBrief(originalBrief);
    setSources([]);
  }, [code]);

  const head = React.useMemo(() => (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <VideoCard video={brief} />
    </div>
  ), [brief]);

  return (
    <>
      {head}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {(() => {
          if (sources === null) {
            return <Error />;
          }
          if (sources.length === 0) {
            return <CircularProgress color="secondary" />;
          }
          return sources.map(
            (url) => (
              <Button key={url} onClick={() => handleVideoClick(url)}>
                {getVideoUrlDomain(url)}
              </Button>
            ),
          );
        })()}
      </div>
    </>
  );
};
