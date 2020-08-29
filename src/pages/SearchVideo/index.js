import React from 'react';
import Button from '@material-ui/core/Button';
import VideoCard from '../../components/VideoCard';
import api from '../../api';
import utils from '../../utils';
import Error from '../../components/Error';

const getVideoUrlDomain = (url) => new URL(url).hostname;

const handleVideoClick = (videoUrl) => {
  if (videoUrl.endsWith('.m3u8') || videoUrl.endsWith('.mp4')) {
    window.open(`${api.address}/#/videoplayer?video_url=${videoUrl}`);
  } else if (videoUrl.includes('hydrax.net')) {
    window.open(`${api.address}/#/iframe?video_url=${videoUrl}`);
  } else {
    window.open(`${api.address}/redirect_to?url=${videoUrl}`, '_blank');
  }
};

export default () => {
  const query = utils.useQuery();
  const code = query.get('code');

  const [brief, setBrief] = React.useState({
    code: '', title: '', preview_img_url: '', actress: [], release_date: '',
  });
  const [sources, setSources] = React.useState([]);

  React.useEffect(() => {
    api.ws.getBrief({ code }).onArrival((av) => {
      setBrief((av0) => utils.mergeVideos(av0, av));
    });

    api.ws.searchByCode({ code }).onArrival((rsp) => {
      if (rsp) {
        setBrief((av0) => utils.mergeVideos(av0, rsp));
        setSources((s) => s.concat(rsp.video_url));
      }
    }).onError((reason) => {
      if (reason === 'not found') {
        setSources(null);
      }
    });
  }, [code]);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <VideoCard video={brief} />

      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {sources === null ? <Error />
          : sources.map(
            (url) => (
              <Button
                onClick={() => handleVideoClick(url)}
              >
                {getVideoUrlDomain(url)}
              </Button>
            ),
          )}
      </div>
    </>
  );
};
