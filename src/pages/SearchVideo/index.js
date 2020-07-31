import React from 'react';
import Videos from '../../components/Videos';
import api from '../../api';
import utils from '../../utils';
import Error from '../../components/Error';

export default () => {
  const query = utils.useQuery();
  const code = query.get('code');

  const [videos, setVideos] = React.useState([]);

  const render = () => {
    if (videos === null) {
      return <Error />;
    }
    return <Videos videos={videos} />;
  };

  React.useEffect(() => {
    api.ws.searchByCode({ code }).onArrival((rsp) => {
      if (rsp) {
        setVideos((v) => v.concat(rsp));
      }
    }).onError((reason) => {
      if (reason === 'not found') {
        setVideos(null);
      }
    });
  }, [code]);

  return render();
};
