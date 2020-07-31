/* eslint-disable no-param-reassign */
import axios from 'axios';
import Cookie from 'js-cookie';
import sha256 from 'js-sha256';
import utils from '../utils';
import ws from './websocket';

let address = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;

if (process && process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line no-console
  console.log('development');
  address = `${window.location.protocol}//${window.location.hostname}:8081`;
}

const setUserpass = (val) => {
  Cookie.set('userpass', val);
};

const getUserpass = () => Cookie.get('userpass');

const hasUserpass = () => Cookie.get('userpass') !== undefined;

const pookie = async (url, data) => {
  const userpass = getUserpass();
  if (!userpass) {
    return null;
  }
  if (data) {
    data.userpass = userpass;
  } else {
    data = { userpass };
  }

  try {
    const rsp = await axios.post(`${address}${url}`, data);
    if (rsp) {
      return rsp;
    }
    return null;
  } catch (err) {
    if (!err.response || err.response.status === 400) {
      Cookie.remove('userpass');
      if (!utils.globalCache.refreshed) {
        utils.globalCache.refreshed = true;
        window.location.reload();
        utils.globalCache.refreshed = false;
      }
    }
  }
  return null;
};

const searchByCode = async ({ code }) => {
  if (utils.globalCache.videos[code] !== undefined) {
    return utils.globalCache.videos[code];
  }

  const rsp = await pookie('/search_by_code', { code });
  if (rsp && rsp.status === 200 && rsp.data) {
    utils.globalCache.videos[code] = rsp.data.videos;
    return rsp.data.videos;
  }
  utils.globalCache.videos[code] = null;
  return null;
};

const getNewlyReleased = async ({ page }) => {
  const rsp = await pookie('/new', { page });
  if (rsp && rsp.status === 200 && rsp.data) {
    return rsp.data;
  }
  return null;
};

const searchByActress = async ({ actress, withProfile }) => {
  if (utils.globalCache.actress.videos[actress] !== undefined) {
    return {
      videos: utils.globalCache.actress.videos[actress],
      actressProfile: utils.globalCache.actress.actressProfile[actress],
      historyNames: utils.globalCache.actress.historyNames[actress],
    };
  }

  const rsp = await pookie('/search_by_actress', { actress, with_profile: withProfile });
  if (!rsp || !rsp.data) {
    return null;
  }

  // cache videos
  utils.globalCache.actress.videos[actress] = rsp.data.videos;

  // cache profile
  const { profile } = rsp.data;

  if (profile) {
    utils.globalCache.actress.actressProfile[actress] = profile;
  } else {
    utils.globalCache.actress.actressProfile[actress] = null;
  }

  // cache history names
  const historyNames = rsp.data.history_names;
  if (historyNames) {
    utils.globalCache.actress.historyNames[actress] = historyNames;
    for (let i = 0; i < historyNames.length; i += 1) {
      utils.globalCache.actress.historyNames[historyNames[i]] = historyNames;
    }
  }

  return {
    videos: rsp.data.videos,
    actressProfile: rsp.data.profile,
    historyNames: rsp.data.history_names,
  };
};

const searchMagnet = async ({ code }) => {
  const rsp = await pookie('/search_magnet_by_code', { code });
  if (rsp && rsp.status === 200 && rsp.data) {
    return rsp.data;
  }
  return null;
};

const authByPassword = async ({ password }) => {
  const rsp = await axios.post(`${address}/auth_by_password`, { password: sha256.sha256(password) });
  if (rsp && rsp.status === 200 && rsp.data) {
    setUserpass(rsp.data);
    return true;
  }
  return false;
};

const getConfigurations = async () => {
  const rsp = await pookie('/get_config');
  if (rsp && rsp.status === 200 && rsp.data) {
    return rsp.data;
  }
  return null;
};

const updateConfigurations = async (data) => {
  if (data.password) {
    data.password = sha256.sha256(data.password);
  }
  const rsp = await pookie('/update_config', data);
  if (rsp && rsp.status === 200 && rsp.data) {
    return rsp.data;
  }
  return null;
};

export default {
  address,
  hasUserpass,
  setUserpass,
  searchByCode,
  getNewlyReleased,
  searchByActress,
  searchMagnet,
  authByPassword,
  getConfigurations,
  updateConfigurations,
  ws,
};
