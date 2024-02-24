
export interface AnkiPayload {
  action: string,
  params: any,
};

export type AnkiCallback<TPayload extends AnkiPayload = AnkiPayload> = (data: TPayload) => Promise<TPayload> | TPayload;

export type AnkiActionHook<TAction extends string = string, TPayload extends AnkiPayload = AnkiPayload> = {
  action: TAction,
  callback: AnkiCallback<TPayload>,
};
