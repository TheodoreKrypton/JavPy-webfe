import sha256 from 'js-sha256';
import Cookie from 'js-cookie';

const socket = new WebSocket('ws://localhost:8081/ws/');

const connectionEstablished = () => socket.readyState === 1;

const connectionStatus = {
  connected: false,
  server: '',
};

socket.onopen = () => {
  connectionStatus.connected = true;
  connectionStatus.server = socket.url;
};

socket.onclose = () => {
  connectionStatus.connected = false;
};

const pipes = {};

socket.addEventListener('message', (event) => {
  const { response, reqId } = JSON.parse(event.data);
  const pipe = pipes[reqId];
  pipe.lastUpdate = Date.now();

  if (response === 'not found') {
    if (pipe.onerror) {
      pipe.onerror('not found');
    }
  } else if (pipe.onarrival) {
    pipe.onarrival(response);
  }

  if (pipe.finally_cb) {
    pipe.finally_cb();
  }
});

class MessagePipe {
  constructor(message) {
    this.lastUpdate = Date.now();
    this.reqId = sha256.sha256(`${message.api}${this.lastUpdate}`).slice(0, 10);
    pipes[this.reqId] = this;
    const userpass = Cookie.get('userpass');
    if (!userpass) {
      return;
    }
    socket.send(JSON.stringify({ message, reqId: this.reqId, userpass }));
  }

  onArrival(fn) {
    this.onarrival = fn;
    return this;
  }

  onError(fn) {
    this.onerror = fn;
    return this;
  }

  finally(fn) {
    this.finally_cb = fn;
  }
}

const searchByCode = ({ code }) => new MessagePipe({ api: 'search_by_code', args: { code } });
const getNewlyReleased = ({ page }) => new MessagePipe({ api: 'get_newly_released', args: { page } });
const searchByActress = ({ actress }) => new MessagePipe({ api: 'search_by_actress', args: { actress } });
const getActressProfile = ({ actress }) => new MessagePipe({ api: 'get_actress_profile', args: { actress } });
const getAliases = ({ actress }) => new MessagePipe({ api: 'get_aliases', args: { actress } });
const searchMagnet = ({ code }) => new MessagePipe({ api: 'search_magnet_by_code', args: { code } });

export default {
  searchByCode,
  connectionEstablished,
  connectionStatus,
  getNewlyReleased,
  searchByActress,
  searchMagnet,
  getActressProfile,
  getAliases,
};
