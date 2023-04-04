import { downloadTranscription } from "./downloadTranscription";
import { firestoreTimestampToDate, isSameDay } from "../../utils/timeUtils";

export async function handleDocumentChanges(
  userId,
  changes,
  setDocuments,
  selectedDay
) {
  for (const change of changes) {
    if (change.type === "added" || change.type === "modified") {
      const doc = change.doc;
      const newDoc = await buildDocumentObject(userId, doc, selectedDay);
      updateDocumentsState(newDoc, change.type, setDocuments);
    }
  }
}

async function buildDocumentObject(userId, doc, selectedDay) {
  const docData = doc.data();
  let textFile = null;

  if (isFileFromSelectedDay(docData.fileCreationTimestamp, selectedDay)) {
    try {
      textFile = await downloadTranscription(userId, docData.fileId);
    } catch (error) {
      console.error("Error downloading transcription:", error);
    }
  } else {
    console.log(
      "File is not from the selected day. Skipping transcription download."
    );
  }

  return {
    id: doc.id,
    ...docData,
    text: textFile,
    timestamp: docData.fileCreationTimestamp,
  };
}

export function updateDocumentsState(newDoc, changeType, setDocuments) {
  if (changeType === "added") {
    setDocuments((prevState) => [newDoc, ...prevState]);
  } else if (changeType === "modified") {
    console.log("Modified document:", newDoc);
    setDocuments((prevState) =>
      prevState.map((d) => (d.id === newDoc.id ? newDoc : d))
    );
  }
}

function isFileFromSelectedDay(fileCreationTimestamp, selectedDay) {
  const selectedDayTimestamp = new Date(selectedDay).setHours(0, 0, 0, 0);
  const fileDayTimestamp = firestoreTimestampToDate(fileCreationTimestamp);

  return isSameDay(fileDayTimestamp, selectedDayTimestamp);
}
