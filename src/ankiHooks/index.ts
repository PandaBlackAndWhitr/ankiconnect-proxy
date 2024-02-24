import { RequestHandler, Response } from 'express';
import { AnkiActionHook, AnkiCallback } from './types';
import { isEmpty } from '../utils';
import { AddNoteActionHook } from './addNote';

export const ankiActionHooks: (...hooks: AnkiActionHook[]) => RequestHandler = (...hookArr) => {
  const hooks = hookArr.reduce<Record<string, AnkiCallback>>((prev, val) => {
    // TODO: Error handling on hooks with same key???
    prev[val.action] = val.callback;
    return prev;
  }, {});

  return (req, res, next) => {
    if (isEmpty(req.body)
      // https://stackoverflow.com/a/1098955
      || !Object.prototype.hasOwnProperty.call(hooks, req.body.action)) return next();

    // TODO: Better logging for actions
    console.log('action:', req.body.action);

    // Handle specific Anki Action Hook
    try {
      const result = hooks[req.body.action](req.body);
      if (result instanceof Promise) {
        result.then((val) => {
          req.body = val;

          // TODO: Make this a setting, rather than a hardcoded throw
          // throw new Error('Do not publish to Anki (testing)');
          next();
        }).catch((err) => handleError(err, res));
      } else {
        req.body = result;
        next();
      }
    } catch(err: any) {
      handleError(err, res);
    }
  };
};

const handleError = (err: any, res: Response) => {
  // TODO: don't post log unless debug level??
  console.log('Error occurred while executing ankiHooks:', err);

  res.send(JSON.stringify({
    result: null,
    error: `ankiHooks failed: ${err.message}`
  }));
}

export const defaultAnkiActionHooks = ankiActionHooks(AddNoteActionHook);
