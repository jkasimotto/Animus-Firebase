import { collection, query, orderBy, where } from "firebase/firestore";
import { db } from "../../firebase";

export function buildDocumentsQuery(userId, selectedDayTimestamp) {
  const documentsRef = collection(db, "users", userId, "files");

  const startDate = new Date(selectedDayTimestamp);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(selectedDayTimestamp);
  endDate.setHours(23, 59, 59, 999);

  console.log("Querying documents between:", startDate, endDate);

  return query(
    documentsRef,
    orderBy("fileCreationTimestamp", "desc"),
    where("fileCreationTimestamp", ">=", startDate),
    where("fileCreationTimestamp", "<=", endDate)
  );
}
