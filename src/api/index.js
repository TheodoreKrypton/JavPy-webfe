/* eslint-disable no-param-reassign */
import axios from 'axios';
import Cookie from 'js-cookie';
import sha256 from 'js-sha256';
import ws from './websocket';

let address = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;

if (process && process.env.NODE_ENV === 'development') {
  address = `${window.location.protocol}//${window.location.hostname}:8081`;
}

const setUserpass = (val) => {
  Cookie.set('userpass', val);
};

const getUserpass = () => Cookie.get('userpass');

const hasUserpass = () => Cookie.get('userpass') !== undefined;

let refreshed = false;

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
      if (!refreshed) {
        refreshed = true;
        window.location.reload();
        refreshed = false;
      }
    }
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
  authByPassword,
  getConfigurations,
  updateConfigurations,
  ws,
};
