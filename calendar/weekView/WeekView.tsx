import type { Event } from '../types';
import { WeekDayView } from './WeekDayView';
import {
  eachDayOfInterval,
  eachHourOfInterval,
  endOfDay,
  endOfWeek,
  formatDate,
  startOfDay,
  startOfWeek,
} from '../DateFunctions';

type WeekViewProps = {
  date: Date;
  events?: Event[];
};

export const WeekView: React.FC<WeekViewProps> = ({ date, events = [] }) => {
  console.log(events);

  const hours = eachHourOfInterval({
    start: startOfDay(date),
    end: endOfDay(date),
  });

  const days = eachDayOfInterval({
    start: startOfWeek(date),
    end: endOfWeek(date),
  });

  return (
    <section id="calendar-day-view" className="flex-1 h-full">
      <div className="min-w-[calc(96px+(144px*7))] flex overflow-y-auto">
        <div className="h-fit flex flex-col">
          {hours.map((time, index) => (
            <div
              key={time.toISOString() + index}
              aria-label={formatDate(time, 'h a')}
              className="min-h-14 w-24 flex items-start justify-center"
            >
              <time
                className="text-xs -m-3 select-none"
                dateTime={formatDate(time, 'yyyy-MM-dd')}
              >
                {index === 0 ? '' : formatDate(time, 'h a')}
              </time>
            </div>
          ))}
        </div>
        <div className="flex flex-1 h-fit">
          {days.map((day) => {
            const iso = day.toISOString();
            return <WeekDayView day={day} key={iso} events={[]} />;
          })}
        </div>
      </div>
    </section>
  );
};
