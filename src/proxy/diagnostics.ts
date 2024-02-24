// For diagnostics on requests
// - A bunch of console.log calls
import type { OnProxyReqCallback } from 'http-proxy-middleware/dist/types';
import { isEmpty } from '../utils';

export const diagnostics: OnProxyReqCallback = (proxyReq, req, res, options) => {
  if (!isEmpty(req.body)) {
    console.log('body exists');
  } else console.log('no body');

  // console.log('req.method:', req.method);

  console.log('reqs content-type header:', req.get('Content-Type'));
  console.log('proxyReqs content-type header:', proxyReq.getHeader('Content-Type'));

  console.log('body (from proxyReq):', (proxyReq as any as Request).body);
  console.log('body (from req):', req.body);

  console.log('reqs content-type header:', req.get('Content-Length'));
  console.log('proxyReqs content-type header:', proxyReq.getHeader('Content-Length'));
}
