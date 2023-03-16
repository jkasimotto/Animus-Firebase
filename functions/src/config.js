// config.js
module.exports = {
  storagePaths: {
    userAudio: (userId, fileId) => `user/${userId}/audio/${fileId}`,
  },
  fileTypes: {
    AUDIO: "audio",
    VIDEO: "video",
    IMAGE: "image",
    DOCUMENT: "document",
  },
};
