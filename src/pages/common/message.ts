import { LocalStorageKey } from "./constants";

export type Message = GetMessage | SetMessage;
export type GetMessage = GetMuteMessage | GetGlobalMessage;
export type SetMessage = SetMuteMessage | SetGlobalMessage;

export type TMessage = {
      key: LocalStorageKey | string,
      payload: MutePayload | unknown,
};

export type GetMuteMessage = {
      key: LocalStorageKey.isMuted,
};

export type SetMuteMessage = {
      key: LocalStorageKey.isMuted,
      payload: MutePayload,
};

export type MutePayload = {
      isMuted: boolean,
};

export type GetGlobalMessage = {
      key: LocalStorageKey | string,
};

export type SetGlobalMessage = {
      key: LocalStorageKey | string,
      payload: unknown,
};
