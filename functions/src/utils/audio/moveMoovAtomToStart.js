const axios = require("axios");

async function moveMoovAtomToStart(buffer) {
  try {
    const response = await axios.post(process.env.CONTAINER_ENDPOINT, buffer, {
      headers: {
        "Content-Type": "application/octet-stream",
      },
      responseType: "arraybuffer",
    });

    if (response.status === 200) {
      return Buffer.from(response.data);
    } else {
      throw new Error("Unexpected response status");
    }
  } catch (error) {
    console.error("Error in moveMoovAtomToStart: ", error);
    return null;
  }
}

module.exports = {
  moveMoovAtomToStart,
};
