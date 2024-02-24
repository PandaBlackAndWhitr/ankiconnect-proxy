import type { RequestHandler } from 'express';
import morgan from 'morgan';

type LoggingOptions = {
  includeBody: boolean
};

// TODO: Can I glean this from morgan lib??? (it's just redefining)
type MorganFormats = 'combined' | 'common' | 'dev' | 'short' | 'tiny';
const combinedStr = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';

export const loggingMiddleware = (options: LoggingOptions): RequestHandler => {
  if (options.includeBody === true) {
    morgan.token('body', (req: any) => JSON.stringify(req.body));

    return morgan(':method :url :status :body')
  } else {
    return morgan('combined');
  }
};

// Morgan: post body, with default combined format
// https://www.npmjs.com/package/morgan#combined
// app.use(morgan('combined'));
// app.use(morgan());
