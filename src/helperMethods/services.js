import { get as httpget } from 'http';
import { get as httpsget } from 'https';
import { Http2ServerRequest } from 'http2';

export const isHttpOrHttps = (url) => {
  // returns 0 if http, 1 if https, -1 if neither
  if (url.indexOf('https://') == 0) {
    return httpsget;
  } else if (url.indexOf('http://') == 0) {
    return httpget;
  } else {
    return -1;
  }
};
