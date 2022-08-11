import nodeFetch from 'node-fetch';
export { Headers } from 'node-fetch';
import fetchCookie from 'fetch-cookie';
export { default as AbortController } from 'abort-controller';

var fetch = fetchCookie(nodeFetch);

export { fetch };
