import { useLocation } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function getDocumentTop() {
  let scrollTop = 0;
  let bodyScrollTop = 0;
  let documentScrollTop = 0;

  if (document.body) {
    bodyScrollTop = document.body.scrollTop;
  }

  if (document.documentElement) {
    documentScrollTop = document.documentElement.scrollTop;
  }

  scrollTop = bodyScrollTop - documentScrollTop > 0
    ? bodyScrollTop
    : documentScrollTop;
  return scrollTop;
}

function getWindowHeight() {
  let windowHeight = 0;
  if (document.compatMode === 'CSS1Compat') {
    windowHeight = document.documentElement.clientHeight;
  } else {
    windowHeight = document.body.clientHeight;
  }

  return windowHeight;
}

function getScrollHeight() {
  let scrollHeight = 0;
  let bodyScrollHeight = 0;
  let documentScrollHeight = 0;

  if (document.body) {
    bodyScrollHeight = document.body.scrollHeight;
  }

  if (document.documentElement) {
    documentScrollHeight = document.documentElement.scrollHeight;
  }
  scrollHeight = bodyScrollHeight - documentScrollHeight > 0
    ? bodyScrollHeight
    : documentScrollHeight;
  return scrollHeight;
}

const onBottom = () => getScrollHeight()
  === getWindowHeight() + getDocumentTop();

const mergeVideos = (oldv, newv) => {
  Object.keys(oldv).forEach((k) => {
    if (!oldv[k] && newv[k]) {
      // eslint-disable-next-line no-param-reassign
      oldv[k] = newv[k];
    }
  });
  if (oldv.actress.length === 0) {
    // eslint-disable-next-line no-param-reassign
    oldv.actress = newv.actress;
  }
  if (newv.preview_img_url
    && oldv.preview_img_url
    && (oldv.preview_img_url.startsWith('https://jdbimgs.com')
      || oldv.preview_img_url.includes('avgle.com'))
  ) {
    // eslint-disable-next-line no-param-reassign
    oldv.preview_img_url = newv.preview_img_url;
  }
  return { ...oldv };
};

const sortVideos = (vs) => Object.values(vs).sort(
  (v1, v2) => Date.parse(v2.release_date) - Date.parse(v1.release_date),
);

let address = `${window.location.hostname}:${window.location.port}`;

if (process && process.env.NODE_ENV === 'development') {
  address = `${window.location.hostname}:8081`;
}

const favourites = {
  cache: (() => {
    const temp = localStorage.getItem('favourites');
    if (!temp) {
      localStorage.setItem('favourites', JSON.stringify({ id: 0, values: {} }));
    }
    return JSON.parse(localStorage.getItem('favourites'));
  })(),

  add(url) {
    if (this.cache[url] !== undefined) {
      return;
    }

    this.cache.id += 1;
    this.cache.values[url] = this.cache.id;
    localStorage.setItem('favourites', JSON.stringify(this.cache));
  },

  remove(url) {
    if (this.cache.values[url] === undefined) {
      return;
    }
    delete this.cache.values[url];
    localStorage.setItem('favourites', JSON.stringify(this.cache));
  },

  contains(url) {
    return this.cache.values[url] !== undefined;
  },
};

export default {
  useQuery,
  onBottom,
  mergeVideos,
  sortVideos,
  address,
  favourites,
};
