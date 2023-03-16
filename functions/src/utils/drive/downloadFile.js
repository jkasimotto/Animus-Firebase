async function downloadFile(drive, fileId) {
    try {
      const response = await drive.files.get(
        {
          fileId: fileId,
          alt: "media",
        },
        {
          responseType: "arraybuffer",
        }
      );
  
      if (response.status === 200) {
        return Buffer.from(response.data);
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      console.error("Error in downloadFile: ", error);
      return null;
    }
  }
  
  module.exports = downloadFile;
  