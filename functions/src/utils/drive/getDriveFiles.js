// getDriveFiles.js
async function getDriveFiles(drive, folderId, lastNotification) {
  let nextPageToken = null;
  let files = [];

  do {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and createdTime > '${lastNotification}' and trashed = false`,
      fields: "nextPageToken, files(id, name, mimeType, size)",
      pageToken: nextPageToken,
    });
    files = files.concat(response.data.files);
    nextPageToken = response.data.nextPageToken;
  } while (nextPageToken);

  return files;
}

module.exports = getDriveFiles;
