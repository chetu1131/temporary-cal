import { cn } from 'utils';
import {
  eachMonthOfInterval,
  endOfYear,
  formatDate,
  startOfYear,
} from '../DateFunctions';

import { Event } from '../types';
import { MonthView } from './YearMonth';

type YearViewProps = {
  date: Date;
  events?: Event[];
};

export const YearView: React.FC<YearViewProps> = ({ date, events = [] }) => {
  const months = eachMonthOfInterval({
    start: startOfYear(date),
    end: endOfYear(date),
  });
  return (
    <section id="calendar-year-view" className="flex-1 flex flex-col p-2 ml-10">
      <div className="grid grid-cols-4 gap-2">
        {months.map((month) => (
          <div key={month.toISOString()} className="text-center w-full">
            <h2
              className={cn(
                'flex justify-start text-base ml-6 font-normal text-center m-1'
              )}
            >
              {formatDate(month, 'MMMM')}
            </h2>
            <MonthView date={month} events={events} />
          </div>
        ))}
      </div>
    </section>
  );
};
