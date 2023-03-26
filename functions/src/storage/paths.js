function getAudioPath(userId, fileId) {
  return `user-audios/${userId}/${fileId}/audio`;
}

function getTranscriptPath(userId, fileId) {
  return `user-transcripts/${userId}/${fileId}/transcript`;
}

module.exports = {
  getAudioPath,
  getTranscriptPath,
};
