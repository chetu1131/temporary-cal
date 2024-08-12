import { cn } from 'utils';
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  formatDate,
  startOfMonth,
  startOfWeek,
} from '../DateFunctions';
import { Event } from '../types';

type MonthViewProps = {
  date: Date;
  events?: Event[];
};

export const MonthView: React.FC<MonthViewProps> = ({ date, events = [] }) => {
  const days = eachDayOfInterval({
    start: startOfWeek(date),
    end: endOfWeek(date),
  });
  const weeks = eachDayOfInterval({
    start: startOfWeek(startOfMonth(date)),
    end: endOfWeek(endOfMonth(date)),
  }).reduce((acc, cur, idx) => {
    const groupIndex: number = Math.floor(idx / 7);

    if (!acc[groupIndex]) {
      acc[groupIndex] = [];
    }
    acc[groupIndex].push(cur);
    return acc;
  }, [] as Date[][]);

  return (
    <div id="calendar-month-view" className="flex flex-col">
      <div className="w-full flex"></div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => (
          <div key={day.toISOString()} className="flex justify-center">
            <span className="mt-2 text-sm font-semibold text-gray-500">
              {formatDate(day, 'EEEEEE').slice(0, 1).toUpperCase()}
            </span>
          </div>
        ))}

        {weeks.map((week, index) => (
          <div key={index} className="flex flex-col">
            {week.map((day) => {
              const dayEvents = events.filter(
                (event) => new Date(event.date).toDateString() === day.toDateString()
              );

              return (
                <div
                  key={day.toISOString()}
                  className="p-2"
                  aria-label={`Events on ${formatDate(day, 'MMMM d')}`}
                >
                  <h3
                    className={cn(
                      'text-center text-sm'
                      // isItToday && 'text-blue-500'
                    )}
                  >
                    {formatDate(day, 'd')}
                  </h3>
                  <div>
                    {dayEvents.map((event) => (
                      <div key={event.id} className="cursor-pointer">
                        <span>{event.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
