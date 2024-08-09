import {
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  formatDate,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from '../DateFunctions';
import { Event } from '../types';
import { MonthWeekView } from './MonthWeekView';

type MonthViewProps = {
  date: Date;
  events?: Event[];
};

export const MonthView: React.FC<MonthViewProps> = ({ date, events = [] }) => {
  console.log(events);

  const days: Date[] = eachDayOfInterval({
    start: startOfWeek(date),
    end: endOfWeek(date),
  });

  const weeks: Date[][] = eachDayOfInterval({
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
    <section id="calendar-month-view" className="flex-1 flex flex-col">
      <div className="w-full flex">
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className="flex-1 flex justify-center border-t border-l last:border-r"
          >
            <span className="mt-2 text-sm font-semibold text-gray-500">
              {formatDate(day, 'EEEEEE')}
            </span>
          </div>
        ))}
      </div>
      <div className="flex-1 flex flex-col">
        {weeks.map((week) => {
          const weekEndDate = endOfDay(week[week.length - 1]);
          const weekStartDate = startOfDay(week[0]);
          const weekKey =
            weekStartDate.toISOString() + '-' + weekEndDate.toISOString();
          const props = { week };

          return <MonthWeekView {...props} key={weekKey} />;
        })}
      </div>
    </section>
  );
};
