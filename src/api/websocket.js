import sha256 from 'js-sha256';

const socket = new WebSocket('ws://localhost:8081/ws/');

const connectionEstablished = () => socket.readyState === 1;

socket.addEventListener('open', () => {
  // eslint-disable-next-line no-console
  console.log('WS connection established');
});

const pipes = {};

socket.addEventListener('message', (event) => {
  const { response, reqId } = JSON.parse(event.data);
  const pipe = pipes[reqId];
  pipe.lastUpdate = Date.now();

  if (response === 'not found') {
    pipe.onerror('not found');
  } else if (pipe.onarrival) {
    pipe.onarrival(response);
  }
});

class MessagePipe {
  constructor(message) {
    this.lastUpdate = Date.now();
    this.reqId = sha256.sha256(`${message.api}${this.lastUpdate}`).slice(0, 10);
    pipes[this.reqId] = this;
    socket.send(JSON.stringify({ message, reqId: this.reqId }));
  }

  onArrival(fn) {
    this.onarrival = fn;
    return this;
  }

  onError(fn) {
    this.onerror = fn;
    return this;
  }
}

const searchByCode = ({ code }) => new MessagePipe({ api: 'search_by_code', args: { code } });
const getNewlyReleased = ({ page }) => new MessagePipe({ api: 'get_newly_released', args: { page } });
const searchByActress = ({ actress, withProfile }) => new MessagePipe({ api: 'search_by_actress', args: { actress, withProfile } });
const searchMagnet = ({ code }) => new MessagePipe({ api: 'search_magnet_by_code', args: { code } });

export default {
  searchByCode,
  connectionEstablished,
  getNewlyReleased,
  searchByActress,
  searchMagnet,
};
