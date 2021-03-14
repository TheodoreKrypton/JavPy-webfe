import React from 'react';
import utils from '../../utils';

export default () => {
  const query = utils.useQuery();

  return (
    <iframe title="video" src={query.get('video_url')} scrolling="no" frameBorder={0} width={700} height="430" allowFullScreen webkitallowfullscreen="true" mozallowfullscreen="true">
      <p>Your browser does not support iframes.</p>
    </iframe>
  );
};
