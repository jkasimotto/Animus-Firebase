// src/utils/timeUtils.js
export const firestoreTimestampToDate = (timestamp) => {
  return new Date(timestamp.seconds * 1000);
};

export const isSameDay = (timestamp1, timestamp2) => {
  const date1 = new Date(timestamp1);
  const date2 = new Date(timestamp2);

  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};
