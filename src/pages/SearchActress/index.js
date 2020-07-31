import React from 'react';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Button from '@material-ui/core/Button';
import utils from '../../utils';
import ScrollableVideos from '../../components/ScrollableVideos';
import api from '../../api';
import ActressProfile from '../../components/ActressProfile';
import Error from '../../components/Error';

export default () => {
  const query = utils.useQuery();
  const actress = query.get('actress');

  const [aliases, setAliases] = React.useState([]);
  const [videos, setVideos] = React.useState({});
  const [videosToRender, setvideosToRender] = React.useState([]);
  const [actressProfile, setActressProfile] = React.useState(null);

  const onArrival = React.useCallback((rsp) => {
    if (Array.isArray(rsp)) {
      rsp.forEach((av) => {
        if (videos[av.code] === undefined) {
          videos[av.code] = av;
        } else {
          Object.keys(av).forEach((key) => {
            if (videos[av.code].actress.length === 0) {
              videos[av.code].actress = av.actress;
            }
            if (!videos[av.code][key]) {
              videos[av.code][key] = av[key];
            }
          });
        }
      });
    } else {
      setActressProfile(rsp);
      const set = new Set(aliases);
      rsp.aliases.forEach((alias) => {
        set.add(alias);
      });
      setAliases([...set].sort());
    }

    setvideosToRender(Object.values(videos).sort(
      (v1, v2) => Date.parse(v2.release_date) - Date.parse(v1.release_date),
    ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onError = (reason) => {
    if (reason === 'not found') {
      setVideos(null);
    }
  };

  const handleClickHistoryName = (name) => {
    setvideosToRender([]);
    setVideos({});
    api.ws.searchByActress({ actress: name, withProfile: 'false' }).onArrival(onArrival).onError(onError);
  };

  const renderActressProfile = () => <ActressProfile profile={actressProfile} name={query.get('actress')} />;

  const renderHistoryNames = () => (
    <div style={{
      display: 'table',
      margin: '0 auto',
    }}
    >
      <Breadcrumbs>
        {aliases.map((name, i) => (
          <Button key={i.toString()} color="secondary" onClick={() => { handleClickHistoryName(name.trim()); }}>
            {name.trim()}
          </Button>
        ))}
      </Breadcrumbs>
    </div>
  );

  const VIDEOS_PER_PAGE = 16;

  const loadNextPage = ({ videosRendered }) => new Promise((resolve) => {
    if (!videosToRender || !videosRendered) {
      resolve([]);
      return;
    }
    let ret = [];
    if (videosRendered.length < VIDEOS_PER_PAGE) {
      const displayed = {};
      videosRendered.forEach((v) => {
        displayed[v.code] = true;
      });
      for (let i = 0; i < videosToRender.length; i += 1) {
        const v = videosToRender[i];
        if (displayed[v.code] === undefined) {
          ret.push(v);
          if (ret.length + videosRendered.length >= VIDEOS_PER_PAGE) {
            break;
          }
        }
      }
    }
    if (videosRendered.length !== 0) {
      const videosCount = videosRendered.length + ret.length;
      const nextPage = videosToRender.slice(videosCount, videosCount + VIDEOS_PER_PAGE);
      ret = ret.concat(nextPage);
    }
    resolve(ret);
  });

  const renderVideos = () => {
    if (videos === null) {
      return <Error />;
    }
    if (videosToRender.length === 0) {
      return <></>;
    }
    return (
      <ScrollableVideos
        initialState={utils.globalCache.page.searchActress}
        loadNextPage={loadNextPage}
      />
    );
  };

  React.useEffect(() => {
    api.ws.searchByActress({ actress, withProfile: 'true' }).onArrival(onArrival).onError(onError);
  }, [actress, onArrival]);

  return (
    <>
      {actressProfile ? renderActressProfile() : <></>}
      {aliases ? renderHistoryNames() : <></>}
      {renderVideos()}
    </>
  );
};
