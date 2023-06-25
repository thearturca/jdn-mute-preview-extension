import "@src/styles/index.css";
import { LocalStorageKey } from "../common/constants";
import { MutePayload, SetMuteMessage } from "../common/message";
import createStoredSignal from "../common/utils";
import styles from "./Popup.module.css";

const Popup = () => {
      const [isMuted, setIsMuted] = createStoredSignal<MutePayload>(LocalStorageKey.isMuted, { isMuted: false });
      const toggleMuted = () => {
            const newValue = setIsMuted(payload => { return { isMuted: !payload.isMuted } });
            chrome.tabs.query({ currentWindow: true }, (tabs) => {
                  const message: SetMuteMessage = {
                        key: LocalStorageKey.isMuted,
                        payload: newValue,
                  };

                  for (const tab of tabs) {
                        if (tab.url && tab.url.includes("justdancenow.com")) {
                              chrome.tabs.sendMessage(tab.id, message).catch(console.error);
                        }
                  }
            });
      };
      return (
            <div class={styles.App}>
                  <main class={styles.header}>
                        <button class={`${isMuted().isMuted ? styles["btn-fuchsia"] : styles["btn-off"]} ${styles["btn"]}`} onClick={toggleMuted}>
                              <h1 class={styles.h1}>
                                    {isMuted().isMuted ? "Unmute" : "Mute"}
                              </h1>
                        </button>
                  </main>
                  <footer class="p-6">
                        <span class="text-base font-bold uppercase text-white">
                              {!isMuted().isMuted ? "Unmuted" : "Muted"} <span class="text-yellow-300">Now</span>
                        </span>
                  </footer>
            </div >
      );
};

export default Popup;
