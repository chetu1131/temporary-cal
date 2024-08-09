import { useState } from 'react';

import type { Event } from '../types';
import { cn } from 'utils';
import { DayProgress } from '../DayProgress';
import { eachHourOfInterval, endOfDay, isToday, startOfDay } from '../DateFunctions';

type WeekDayViewProps = {
  day: Date;
  events?: Event[];
};

export const WeekDayView: React.FC<WeekDayViewProps> = ({
  day,
  // events = []
}) => {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const isDayToday: boolean = isToday(new Date(day));
  const hours: Date[] = eachHourOfInterval({
    start: startOfDay(day),
    end: endOfDay(day),
  });

  return (
    <div
      aria-label={'Events slot for ' + day.toDateString()}
      className="min-w-36 h-full flex flex-1 relative"
    >
      <div className="w-[95%] h-full absolute">
        <div className="w-full h-full relative" ref={(ref) => setRef(ref)} />
      </div>
      <div className="w-full flex flex-col">
        {hours.map((time, index) => (
          <div
            key={time.toISOString()}
            className={cn(
              'h-14 w-full border-l',
              index !== hours.length - 1 && 'border-b'
            )}
          />
        ))}
      </div>
      {isDayToday && <DayProgress containerHeight={ref?.offsetHeight || 1} />}
    </div>
  );
};
