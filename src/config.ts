import { Options as ProxyMiddlewareOptions } from 'http-proxy-middleware';

export type AppConfig = {
  port: number,
  anki: ProxyMiddlewareOptions
};

// TODO: Config options
// - These are defaults, but can I read them from somewhere???
export const config: AppConfig = {
  port: 3000,
  anki: {
    // TODO: Toggle based on if running in docker container
    // target: 'http://localhost:8765',
    target: 'http://host.docker.internal:8765',
    changeOrigin: false,

    // TODO: Merge logging config stuff with logging code???
    logLevel: 'info',
    /*
    onError: (err, req, res, target) => {
      console.log('error:', err);
      console.log('req.body:', req.body);
    },
    */
  },
};