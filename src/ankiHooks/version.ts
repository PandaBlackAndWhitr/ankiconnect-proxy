import { AnkiActionHook } from './types';


export const testingHook : AnkiActionHook = {
  action: 'version',
  callback: (data) => {
    console.log('CHECK VERSION?');
    return data;
  },
};
