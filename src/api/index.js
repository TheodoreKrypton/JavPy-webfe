/* eslint-disable no-param-reassign */
import axios from 'axios';
import Cookie from 'js-cookie';
import sha256 from 'js-sha256';
import ws from './websocket';
import utils from '../utils';

const address = `${window.location.protocol}//${utils.address}`;

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
      window.location.reload();
    }
  }
  return null;
};

const authByPassword = async ({ password }) => {
  const rsp = await (password === null
    ? axios.post(`${address}/is_public`)
    : axios.post(`${address}/auth_by_password`, { password: sha256.sha256(password) })
  );
  if (rsp && rsp.status === 200 && rsp.data) {
    setUserpass(rsp.data);
    console.log(getUserpass());
    window.location.reload();
  }
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
