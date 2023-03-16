import React, { useState, useContext } from "react";
import { getDownloadURL, getStorage, uploadBytes, ref } from "firebase/storage";
import { storage, db } from "../firebase";
import { AuthContext } from "../auth/auth";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";

const AudioUpload = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useContext(AuthContext);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUploadClick = async () => {
    setIsUploading(true);

    try {
      const userId = user.uid;
      const audioId = await uploadAudio(file, userId);
      console.log(`Audio file uploaded with ID: ${audioId}`);
    } catch (error) {
      console.log(`Error uploading audio file: ${error}`);
    }

    setIsUploading(false);
  };

  return (
    <div>
      <label htmlFor="fileInput">Choose an audio file to upload:</label>
      <input
        type="file"
        id="fileInput"
        accept="audio/*"
        onChange={handleFileChange}
      />

      <button onClick={handleUploadClick} disabled={!file || isUploading}>
        Upload
      </button>
    </div>
  );
};

async function uploadAudio(file, userId) {
  try {
    const filename = file.name;
    const filepath = `user/${userId}/audio/${filename}`;
    const storageRef = ref(storage, filepath);
    await uploadBytes(storageRef, file).then((snapshot) => {
      console.log("Uploaded a blob or file!");
    });

    const fileUrl = await getDownloadURL(storageRef);
    const fileRef = collection(db, "users", userId, "audio_files");
    const audioFileRef = await addDoc(fileRef, { filename:filename, url: fileUrl });

    console.log(`Audio file created with ID: ${audioFileRef.id}.`);

    return audioFileRef.id;
  } catch (error) {
    console.log(`Error uploading audio file: ${error}`);
    throw new Error("Error uploading audio file.");
  }
}

export default AudioUpload;
