import React, { createContext, useState } from "react";
import dayjs from "dayjs";

export const TimePeriodContext = createContext();

const getDaysAgo = (n) => {
  return dayjs().subtract(n, 'day').toDate();
};

export const TimePeriodProvider = ({ children }) => {
  const [startDate, setStartDate] = useState(dayjs().toDate());
  const [endDate, setEndDate] = useState(dayjs().toDate());

  const setDay = (date) => {
    setStartDate(dayjs(date).startOf('day').toDate());
    setEndDate(dayjs(date).endOf('day').toDate());
  };

  const setPastNDays = (n) => {
    setStartDate(getDaysAgo(n));
    setEndDate(dayjs().toDate());
  };

  const setCustomRange = (start, end) => {
    setStartDate(dayjs(start).toDate());
    setEndDate(dayjs(end).toDate());
  };

  const value = {
    startDate,
    endDate,
    setDay,
    setPastNDays,
    setCustomRange,
  };

  return (
    <TimePeriodContext.Provider value={value}>
      {children}
    </TimePeriodContext.Provider>
  );
};

export default TimePeriodProvider;
