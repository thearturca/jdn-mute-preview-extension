import { createEffect, createSignal, Signal } from "solid-js";
import { LS } from "../background";
import { GetGlobalMessage, SetGlobalMessage } from "./message";

export default function createStoredSignal<T>(
      key: string,
      defaultValue: T,
): Signal<T> {

      const [value, setValue] = createSignal<T>(defaultValue);

      chrome.runtime.sendMessage<GetGlobalMessage, T>({ key }, (value) => {
            console.log(value);
            if (value)
                  setValue(() => value);
            else
                  chrome.runtime.sendMessage<SetGlobalMessage>({ key, payload: JSON.stringify(defaultValue) });
      });

      const setValueAndStore = ((arg) => {
            const v = setValue(arg);
            LS.setItem(key, JSON.stringify(v));
            return v;
      }) as typeof setValue;

      createEffect(() => {
            LS.getItem(key).then((value) => {
                  if (value)
                        setValue(() => value);
                  else
                        LS.setItem(key, JSON.stringify(defaultValue));
            });
      });

      return [value, setValueAndStore];
}
