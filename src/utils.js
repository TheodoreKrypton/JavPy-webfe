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
  return { ...oldv };
};

const sortVideos = (vs) => Object.values(vs).sort(
  (v1, v2) => Date.parse(v2.release_date) - Date.parse(v1.release_date),
);

export default {
  useQuery,
  onBottom,
  mergeVideos,
  sortVideos,
};
