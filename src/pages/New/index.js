import React from 'react';
import ScrollableVideos from '../../components/ScrollableVideos';
import api from '../../api';
import utils from '../../utils';

export default () => {
  const loadNextPage = ({ page }) => new Promise((resolve) => {
    api.ws.getNewlyReleased({ page }).onArrival((rsp) => {
      resolve(rsp);
    });
  });

  return (
    <ScrollableVideos loadNextPage={loadNextPage} initialState={utils.globalCache.page.new} />
  );
};
