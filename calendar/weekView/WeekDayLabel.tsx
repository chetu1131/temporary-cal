import { cn } from 'utils';
import { formatDate, isToday } from '../DateFunctions';

export type WeekDayLabelProps = {
  day: Date;
};

export const WeekDayLabel: React.FC<WeekDayLabelProps> = ({ day }) => {
  const isDayToday: boolean = isToday(day);

  return (
    <div className="flex-1 min-w-36 flex flex-col items-center sticky top-0">
      <span
        aria-hidden
        className={cn('text-md text-gray-400', isDayToday && 'text-blue-600')}
      >
        {formatDate(day, 'EEEEEE')}
      </span>
      <div
        aria-label={day.toDateString()}
        className={cn(
          'w-11 h-11 rounded-full flex items-center justify-center text-2xl font-medium text-gray-400',
          isDayToday && 'text-white bg-blue-600'
        )}
      >
        <p className="leading-[44px]">{formatDate(day, 'd')}</p>
      </div>
    </div>
  );
};
