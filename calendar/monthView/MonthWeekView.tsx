import { cn } from 'utils';
import { Event } from '../types';
import {
  addDays,
  endOfMonth,
  formatDate,
  isSameDay,
  isToday,
  startOfMonth,
} from '../DateFunctions';

type MonthWeekViewProps = {
  week: Date[];
  week_events?: [];
  week_day_events?: Record<string, Event[]>;
};

export const MonthWeekView: React.FC<MonthWeekViewProps> = ({
  week,
  // week_events = [],
  // week_day_events = {},
}) => {
  const thisMonthDates =
    week &&
    week.filter((day) => {
      const now = new Date(day);
      const dateArray = [];
      const startDate = startOfMonth(now);
      const endDate = endOfMonth(now);
      let currentDate = startDate;
      while (currentDate <= endDate) {
        dateArray.push(new Date(currentDate));
        currentDate = addDays(currentDate, 1);
      }

      return dateArray;
    });
  console.log(thisMonthDates);

  return (
    <div className="w-full h-full relative">
      <div className="w-full h-full flex">
        {week &&
          week.map((day) => {
            const isStartOfMonth: boolean = isSameDay(day, startOfMonth(day));
            const isItToday: boolean = isToday(day);
            const text: string = isStartOfMonth
              ? formatDate(day, 'd MMM')
              : formatDate(day, 'd');
            const startDate = startOfMonth(day);
            // const endDate = endOfMonth(day);
            return (
              <div
                key={'day-label-' + day.toISOString()}
                className="flex-1 flex flex-col items-center border-b border-l last:border-r h-36"
              >
                <h2
                  className={cn(
                    'my-2 flex justify-center items-center text-sm font-semibold bg-transparent text-gray-500 w-6 h-6 rounded-full',
                    isItToday && 'bg-blue-400 text-white',
                    isStartOfMonth && 'px-2 rounded-xl text-purple-500',
                    startDate && 'text-blue-800'
                  )}
                >
                  {text}
                </h2>
              </div>
            );
          })}
      </div>
      <div className="mt-10 mb-6 absolute inset-0 space-y-1 overflow-hidden"></div>
    </div>
  );
};
