import { useState, useEffect } from 'react';
import { differenceInMinutes, isToday, startOfDay } from './DateFunctions';

const ONE_MINUTE = 60 * 1000;
const MINUTES_IN_DAY = 24 * 60;

type DayProgressProps = {
  containerHeight: number;
  classNames?: string;
};

export const DayProgress: React.FC<DayProgressProps> = ({
  containerHeight,
  classNames: style,
}) => {
  const [top, setTop] = useState(0);
  const today = new Date();
  const isItToday = isToday(today);
  const startOfToday = startOfDay(today);

  useEffect(() => {
    const updateTop = () => {
      const minutesPassed = differenceInMinutes(today, startOfToday);
      const percentage = minutesPassed / MINUTES_IN_DAY;
      const top = percentage * containerHeight;
      setTop(top);
    };

    updateTop();
    const interval = setInterval(() => updateTop(), ONE_MINUTE);
    console.log('update on today and start of day dependency');

    return () => clearInterval(interval);
  }, [containerHeight, isItToday]);

  return (
    <div
      aria-hidden
      style={{ top }}
      aria-label="day time progress"
      className={`h-1 w-full absolute -translate-y-1/2 `}
    >
      <div className="relative w-full h-full">
        <div
          aria-label="current time dot"
          className={`w-4 aspect-square rounded-full absolute -left-2 top-1/2 -translate-y-1/2  bg-[rgb(234,67,53)] ${style}`}
        />
        <div
          aria-label="current time line"
          className={` h-[2px] w-full absolute top-1/2 -translate-y-1/2 bg-[rgb(234,67,53)] ${style}`}
        />
      </div>
    </div>
  );
};
