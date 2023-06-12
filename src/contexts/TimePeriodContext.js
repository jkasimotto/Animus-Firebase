import React, { createContext, useState } from "react";
import dayjs from "dayjs";

export const TimePeriodContext = createContext();

const getDaysAgo = (n) => {
    return dayjs().subtract(n, 'day').toDate();
};

export const TimePeriodProvider = ({ children }) => {
    const [startDate, setStartDate] = useState(
        process.env.NODE_ENV === 'development'
            ? dayjs('2023-05-22').startOf('day')
            : dayjs().startOf('day')
    );
    const [endDate, setEndDate] = useState(
        process.env.NODE_ENV === 'development'
            ? dayjs('2023-05-22').endOf('day')
            : dayjs().endOf('day')
    );

    const setDay = (date) => {
        setStartDate(dayjs(date).startOf('day'));
        setEndDate(dayjs(date).endOf('day'));
    };

    const setPastNDays = (n) => {
        setStartDate(getDaysAgo(n));
        setEndDate(dayjs());
    };

    const setCustomRange = (start, end) => {
        setStartDate(dayjs(start));
        setEndDate(dayjs(end));
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
