import "@src/styles/index.css";
import { LocalStorageKey } from "../common/constants";
import { MutePayload, SetMuteMessage } from "../common/message";
import createStoredSignal from "../common/utils";
import styles from "./Popup.module.css";

const Popup = () => {
      const [isMuted, setIsMuted] = createStoredSignal<MutePayload>(LocalStorageKey.isMuted, { isMuted: false });
      const toggleMuted = () => {
            const newValue = setIsMuted(payload => { return { isMuted: !payload.isMuted } });
            try {
                  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                        const message: SetMuteMessage = {
                              key: LocalStorageKey.isMuted,
                              payload: newValue,
                        };

                        try {
                              chrome.tabs.sendMessage(tabs[0].id, message);
                        }
                        catch (error) {
                        }
                  });

            }
            catch (error) {
            }
      };
      return (
            <div class={styles.App}>
                  <header class={styles.header}>
                        <button class={styles["btn-blue"]} onClick={toggleMuted}>
                              <h1 class={styles.h1}>
                                    {isMuted().isMuted ? "Unmute" : "Mute"}
                              </h1>
                        </button>
                  </header>
            </div >
      );
};

export default Popup;
