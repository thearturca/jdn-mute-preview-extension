import { LocalStorageKey } from "../common/constants";
import { GetMuteMessage, MutePayload, SetMessage } from "../common/message";

let previewVolume = 1;
let targetNode: HTMLElement;
try {
      targetNode = document.getElementById("preview");
}
catch (error) {

}

const mutePreview = (isMuted: boolean): boolean => {
      try {
            const videos = Array.from(targetNode.getElementsByClassName("video-preview")).flatMap(item => Array.from(item.getElementsByTagName("video")));
            for (const video of videos) {
                  if (isMuted) {
                        if (video.volume > 0) {
                              previewVolume = video.volume;
                              video.volume = 0;
                        }
                  }
                  else {
                        if (video.volume == 0) {
                              video.volume = previewVolume;
                        }
                  }
            }
            return true;
      }
      catch (error) {
      }
      return false;
};

let isMuted = false;

chrome.runtime.sendMessage<GetMuteMessage, MutePayload | undefined>({ key: LocalStorageKey.isMuted }, (message) => {
      isMuted = message?.isMuted ?? isMuted;
});

const videoPreviewMutationObserver = new MutationObserver((mutationList) => {
      for (const mutation of mutationList) {
            mutation.addedNodes.forEach((node) => {
                  if (node.nodeName == "VIDEO") {
                        mutePreview(isMuted);
                  }
            });
      }
});
const interval = setInterval(() => {
      targetNode = document.getElementById("preview");
      const isDone: boolean = mutePreview(isMuted);

      if (isDone) {
            clearInterval(interval);
            videoPreviewMutationObserver.observe(targetNode.getElementsByClassName("video-preview")[0], { attributes: false, childList: true, subtree: true });
      }

}, 2000);

chrome.runtime.onMessage.addListener(
      (message: SetMessage) => {
            console.log(message);
            if ("payload" in message) {
                  if (message.key == LocalStorageKey.isMuted && typeof message.payload == "object" && "isMuted" in message.payload && typeof message.payload.isMuted === "boolean") {
                        isMuted = message.payload.isMuted;
                        mutePreview(isMuted);
                  }
            }
      }
);
