import React from 'react';
import Videos from '../Videos';
import utils from '../../utils';

export default (props) => {
  const { initialState, loadNextPage } = props;
  const [page, setPage] = React.useState(initialState.page);
  const [videos, setVideos] = React.useState(initialState.videos);

  const load = async () => {
    const rsp = await loadNextPage({ page, videosRendered: videos });
    if (rsp) {
      const v = videos.concat(rsp);
      initialState.videos = v;
      setVideos(v);
    }
  };

  React.useEffect(() => {
    window.onwheel = utils.debounce(() => {
      initialState.scrollY = utils.getDocumentTop();
      if (loadNextPage && utils.getScrollHeight()
        === utils.getWindowHeight() + utils.getDocumentTop()) {
        initialState.page += 1;
        setPage(initialState.page);
      }
    }, 100);

    if (initialState.scrollY) {
      window.scrollTo(0, initialState.scrollY);
    } else {
      load();
    }

    return () => {
      window.onwheel = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (!loadNextPage) {
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return <Videos videos={videos} />;
};
