import { ref, getDownloadURL } from "firebase/storage";
import { retry } from "../../utils/retry";
import {
  setWithExpiry,
  getWithExpiry,
} from "../../utils/localStorageWithExpiry";
import { firestoreTimestampToDate, isSameDay } from "../../utils/timeUtils";
import { storage } from "../../firebase";

const cacheTTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export async function downloadTranscription(
  userId,
  fileId,
) {

  const localStorageKey = `transcription-${userId}-${fileId}`;

  const cachedTranscription = getWithExpiry(localStorageKey);
  if (cachedTranscription) {
    console.log("Returning transcription from localStorage:", fileId);
    return cachedTranscription;
  }

  return downloadAndCacheTranscription(userId, fileId, localStorageKey);
}

function isFileFromSelectedDay(fileCreationTimestamp, selectedDay) {
  const selectedDayTimestamp = new Date(selectedDay).setHours(0, 0, 0, 0);
  const fileDayTimestamp = firestoreTimestampToDate(fileCreationTimestamp);

  return isSameDay(fileDayTimestamp, selectedDayTimestamp);
}

async function downloadAndCacheTranscription(userId, fileId, localStorageKey) {
  const fileRef = ref(
    storage,
    `user-transcripts/${userId}/${fileId}/transcript`
  );

  console.log("Downloading transcription from:", fileRef.fullPath);

  try {
    const url = await getDownloadURL(fileRef);
    const response = await retry(() => fetch(url));
    const transcription = await response.text();
    setWithExpiry(localStorageKey, transcription, cacheTTL);
    return transcription;
  } catch (error) {
    console.error("Error downloading transcription:", error);
    throw error;
  }
}
