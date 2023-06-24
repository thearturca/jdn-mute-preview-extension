import { Message } from "../common/message";

export const LS = {
      getAllItems: () => chrome.storage.local.get(),
      getItem: async key => (await chrome.storage.local.get(key))[key],
      setItem: (key, val) => chrome.storage.local.set({ [key]: val }),
      removeItems: keys => chrome.storage.local.remove(keys),
};

console.log("background loaded");
chrome.runtime.onMessage.addListener((message: Message, sender, sendMessage: (message: Message) => void) => {
      console.log("bg", message)
      if (!("payload" in message)) {
            LS.getItem(message.key).then((value) => value ? sendMessage(JSON.parse(value)) : value)
            return true;
      } else {
            LS.setItem(message.key, JSON.stringify(message.payload));
      }
});
