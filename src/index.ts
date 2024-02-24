import express from 'express';
import cors from 'cors';
import { loggingMiddleware } from './logging';
import { config } from './config';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { writeBody } from './proxy/writeBody';
import { testingHook } from './ankiHooks/version';
import { AddNoteActionHook } from './ankiHooks/addNote';
import { ankiActionHooks } from './ankiHooks';

const app = express();

// Populates request.body:
// https://nodejs.org/en/learn/modules/anatomy-of-an-http-transaction#request-body
// https://stackoverflow.com/a/67497948
// https://expressjs.com/en/5x/api.html#express.json
app.use(express.json({
  // TODO: What's a good limit???
  // - Needed to increase, as express.json was failing on PayloadTooLargeError
  // https://stackoverflow.com/a/50989325
  limit: '200mb'
}));

app.use(cors({}));
app.use(loggingMiddleware({ includeBody: false }));
app.use(ankiActionHooks(AddNoteActionHook));

app.use(createProxyMiddleware({
  ...config.anki,
  onProxyReq: writeBody,
}));

// TODO: This is overwritten by the createProxyMiddleware config (lol)
/*
app.get('/', (req, res) => {
  res.send('Hello world!');
});
*/

app.listen(config.port, () => {
  console.log('Server started!');
})

