import React from 'react';
import { formatDate, isToday } from '../DateFunctions';
import { cn } from 'utils';

export type DayLabelProps = {
  date: Date;
};

const DayLabel: React.FC<DayLabelProps> = ({ date }) => {
  const isDayToday: boolean = isToday(date);

  return (
    <div className="border-b flex">
      <div className="w-24 h-14 flex justify-center items-center">
        <span className="text-sm text-center text-gray-400">
          {formatDate(new Date(), 'z')}
        </span>
      </div>
      <div className="flex flex-col flex-1 justify-start items-start border-l">
        <span
          className={cn(
            'text-sm font-medium items-center text-gray-400 ml-5',
            isDayToday && 'text-blue-500'
          )}
        >
          {formatDate(date, 'EEEEEE')}
        </span>
        <span
          className={cn(
            'ml-5 text-xl font-medium text-gray-400 h-8 w-8',
            isDayToday && 'text-white bg-blue-600 rounded-full text-center ml-3'
          )}
        >
          {formatDate(date, 'd')}
        </span>
      </div>
    </div>
  );
};

export default DayLabel;
