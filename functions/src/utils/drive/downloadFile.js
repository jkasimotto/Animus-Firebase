const functions = require("firebase-functions");

  // async function downloadAudioFile(drive, fileId) {
  //   const res = await drive.files.get(
  //     {
  //       fileId,
  //       alt: "media",
  //     },
  //     {
  //       responseType: "stream",
  //     }
  //   );
  
  //   const chunks = [];
  //   return new Promise((resolve, reject) => {
  //     res.data.on("error", reject);
  //     res.data.on("data", (chunk) => chunks.push(chunk));
  //     res.data.on("end", () => {
  //       const buffer = Buffer.concat(chunks);
  //       // Log size
  //       functions.logger.info("Downloaded audio file size: ", buffer.length);
  //       resolve(buffer);
  //     });
  //   });
  // }

  async function downloadAudioFile(drive, fileId) {
    try {
      const response = await drive.files.get(
        {
          fileId: fileId,
          alt: "media",
        },
        { responseType: "arraybuffer" }
      );
      return new Uint8Array(response.data);
    } catch (error) {
      console.error("Error while downloading audio file:", error.response.data);
      throw error;
    }
  }
  
  module.exports = downloadAudioFile;
  

