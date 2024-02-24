import type { OnProxyReqCallback, Request } from 'http-proxy-middleware/dist/types';
import { isEmpty } from '../utils';

// Restream body (if necesary)
// Need to restream the body
// https://stackoverflow.com/a/39852081
export const writeBody: OnProxyReqCallback = (proxyReq, req, res, options) => {
  // Skip if there's no body to process
  if (isEmpty(req.body)) return;

  // TODO: Seems we can't even read application/x-www-form-urlencoded type items
  // TODO: if content-type is application/x-www-form-urlencoded -> we need to change to application/json
  // https://stackoverflow.com/a/39852081
  // - Maybe just don't check Content-Type???
  if (req.get('Content-Type') === 'application/x-www-form-urlencoded') {
    proxyReq.setHeader('Content-Type', 'application/json');
  }

  /*
  if (req.method === 'POST' && req.get('Content-Type') !== 'application/json') {
    throw new Error(`Expected content type to be application/json (got ${req.get('Content-Type')})`);
  }
  */

  const bodyStr = JSON.stringify(req.body);

  // TODO: Is it more efficient to check when Content-Length varies, or is it better to just write?
  // - Either way, it's an optimization concern
  // console.log('reqs content-type header:', req.get('Content-Length'));
  // console.log('proxyReqs content-type header:', proxyReq.getHeader('Content-Length'));
  proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyStr));

  // proxyReq.setHeader('Content-Type', 'application/json');
  proxyReq.write(bodyStr);
};