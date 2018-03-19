import fetch from 'fetch';

const statusError = (res, url) => {
  let err = new Error(`${res.status}: ${url}`);
  err.url = url;
  err.status = res.status;
  throw err;
}

export const fetchJSON = async url => {
  let res = await fetch(url);
  if(res.status < 400) {
    return await res.json();
  }
  throw statusError(res, url);
};

export const fetchText = async url => {
  let res = await fetch(url);
  if(res.status < 400) {
    return await res.text();
  }
  throw statusError(res, url);
};