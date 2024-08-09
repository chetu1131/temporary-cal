import { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from 'utils';
import { DayView } from './dayView/DayView';
import { Event } from './types';
import {
  addDays,
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfWeek,
  formatDate,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from './DateFunctions';
import { WeekView } from './weekView/WeekView';
import DayLabel from './dayView/DayLabel';
import { WeekDayLabel } from './weekView/WeekDayLabel';
import { MonthView } from './monthView/MonthView';

type View = 'day' | 'week' | 'month';

export type CalendarProps = {
  view?: View;
  events?: Event[];
  date: Date;
};

export const Calendar: React.FC<CalendarProps> = ({
  date,
  view = 'day',
  events,
}) => {
  const [curView, setCurView] = useState<View>(view);
  const [curDate, setCurDate] = useState<Date>(new Date(date));

  const onPrev = useCallback(() => {
    if (curView === 'day') {
      return setCurDate((prev) => subDays(prev, 1));
    }

    if (curView === 'week') {
      return setCurDate((prev) => subWeeks(prev, 1));
    }

    return setCurDate((prev) => subMonths(prev, 1));
  }, [curView]);

  const onNext = useCallback(() => {
    if (curView === 'day') {
      return setCurDate((prev) => addDays(prev, 1));
    }

    if (curView === 'week') {
      return setCurDate((prev) => addWeeks(prev, 1));
    }

    return setCurDate((prev) => addMonths(prev, 1));
  }, [curView]);

  const formatDateForView = useCallback(
    (date: Date) => {
      if (curView === 'day') {
        return formatDate(date, 'dd MMMM yyyy');
      }

      if (curView === 'week') {
        const weekStart: Date = startOfWeek(date);
        const weekEnd: Date = endOfWeek(date);
        const startMonth: string = formatDate(weekStart, 'MMM');
        const endMonth: string = formatDate(weekEnd, 'MMM');
        const year: string = formatDate(weekStart, 'yyyy');

        if (startMonth !== endMonth) {
          return `${startMonth} – ${endMonth} ${year}`;
        } else {
          return `${startMonth} ${year}`;
        }
      }

      return formatDate(date, 'MMMM yyyy');
    },
    [curView]
  );

  const days: Date[] = eachDayOfInterval({
    start: startOfWeek(curDate),
    end: endOfWeek(curDate),
  });
  useEffect(() => {
    setCurDate(new Date());
  }, []);
  return (
    <div id="calendar" className="w-full flex flex-col">
      <section id="calendar-header " className="bg-gray-50 sticky top-0 z-50">
        <div className="mb-6 w-full flex justify-between mt-2">
          <div className="flex gap-2 items-center ml-5 ">
            <button
              aria-label="set date today"
              onClick={() => setCurDate(new Date())}
              className="py-2 px-3 border bg-white border-gray-200 rounded-md font-semibold hover:bg-blue-100 transition-colors duration-300"
            >
              Today
            </button>
            <button
              onClick={onPrev}
              aria-label={`prev ${curView}`}
              className="w-[42px] aspect-square border border-gray-200 rounded-full font-semibold flex justify-center items-center hover:bg-blue-100 transition-colors duration-300"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={onNext}
              aria-label={`next ${curView}`}
              className="w-[42px] aspect-square border border-gray-200 rounded-full font-semibold flex justify-center items-center hover:bg-blue-100 transition-colors duration-300"
            >
              <ChevronRight />
            </button>
            <span className="ml-6 font-semibold text-xl">
              {formatDateForView(curDate)}
            </span>
          </div>
          <div className="flex gap-2 mr-5">
            <button
              aria-label="set month view"
              onClick={() => setCurView('month')}
              className={cn(
                'py-2 px-3 border border-gray-200 rounded-md font-semibold hover:bg-blue-100 transition-colors duration-300',
                curView === 'month' && 'bg-blue-400 text-white hover:bg-blue-700'
              )}
            >
              Month
            </button>
            <button
              aria-label="set month week"
              onClick={() => setCurView('week')}
              className={cn(
                'py-2 px-3 border border-gray-200 rounded-md font-semibold hover:bg-blue-100 transition-colors duration-300',
                curView === 'week' && 'bg-blue-400 text-white hover:bg-blue-700'
              )}
            >
              Week
            </button>
            <button
              aria-label="set month day"
              onClick={() => setCurView('day')}
              className={cn(
                'py-2 px-3 border border-gray-200 rounded-md font-semibold hover:bg-blue-100 transition-colors duration-300',
                curView === 'day' && 'bg-blue-400 text-white hover:bg-blue-700'
              )}
            >
              Day
            </button>
          </div>
        </div>
        {curView === 'day' && <DayLabel date={curDate} />}
        {curView === 'week' && (
          <div className="min-w-[calc(96px+(144px*7))] flex border-b scrollbar-gutter-stable h-24">
            <div className="min-w-24 h-14 flex justify-center items-center ">
              <span className="text-sm text-gray-400">
                {formatDate(new Date(), 'z')}
              </span>
            </div>
            <div className="flex flex-col flex-1 static">
              <div className="relative flex flex-1">
                {days.map((day) => (
                  <WeekDayLabel
                    day={day}
                    key={'week-day-label-' + day.toISOString()}
                  />
                ))}
              </div>
              <div className="relative min-h-6">
                <div className="absolute inset-0 h-full flex flex-1">
                  <div className="flex-1 min-w-36 border-l" />
                  <div className="flex-1 min-w-36 border-l" />
                  <div className="flex-1 min-w-36 border-l" />
                  <div className="flex-1 min-w-36 border-l" />
                  <div className="flex-1 min-w-36 border-l" />
                  <div className="flex-1 min-w-36 border-l" />
                  <div className="flex-1 min-w-36 border-l" />
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
      {curView === 'day' && <DayView date={curDate} events={events} />}
      {curView === 'week' && <WeekView date={curDate} events={events} />}
      {curView === 'month' && <MonthView date={curDate} events={events} />}
    </div>
  );
};
