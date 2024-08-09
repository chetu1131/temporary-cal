export const addDays = (date: Date, days: number): Date => {
  const result: Date = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const addTime = (startTime: number, endTime: number) => {
  const date: Date = new Date(startTime);
  date.setTime(date.getTime());
  endTime = endTime - date.getTime();
  return { startTime, endTime };
};

export const addWeeks = (date: Date, weeks: number): Date => {
  return addDays(date, weeks * 7);
};

export const addMonths = (date: Date, months: number): Date => {
  const result: Date = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

export const subDays = (date: Date, days: number): Date => {
  return addDays(date, -days);
};

export const subWeeks = (date: Date, weeks: number): Date => {
  return addDays(date, -weeks * 7);
};

export const subMonths = (date: Date, months: number): Date => {
  return addMonths(date, -months);
};

export const startOfWeek = (date: Date): Date => {
  const result: Date = new Date(date);
  const day: number = result.getDay();
  const diff: number = result.getDate() - day + (day === 0 ? -7 : 0); // Adjust when day is Monday : 1 or Sunday : 0
  result.setDate(diff);
  return new Date(result.setHours(0, 0, 0, 0));
};

export const endOfWeek = (date: Date): Date => {
  const result: Date = startOfWeek(date);
  result.setDate(result.getDate() + 6);
  return new Date(result.setHours(23, 59, 59, 999));
};

export const formatDate = (date: Date, format: string): string => {
  const map: { [key: string]: string } = {
    dd: ('0' + date.getDate()).slice(-2),
    MMMM: date.toLocaleString('default', { month: 'long' }),
    MMM: date.toLocaleString('default', { month: 'short' }),
    yyyy: date.getFullYear().toString(),
    // z: date.toLocaleDateString('en-US', { timeZoneName: 'short' }).split(' ')[1], // Timezone
    z: date.toString().match(/([A-Z]+[/+-][0-9]+)/)?.[1] || '', //toString().match(/\(([A-Za-z\s].*)\)/)[1]
    h: (date.getHours() % 12 || 12).toString(),
    m: date.getMinutes().toString(),
    EEEEEE: date.toLocaleDateString('en-US', { weekday: 'short' }), // First letter of the weekday narrow short long
    d: date.getDate().toString(),
    a: date.getHours() < 12 ? 'AM' : 'PM',
    'h a': date.toLocaleString('en-US', { hour: 'numeric', hour12: true }), // Hour and AM/PM
    'yyyy-MM-dd': date.toISOString().split('T')[0], // Date in yyyy-MM-dd format
  };

  return format.replace(
    /dd|MMMM|MMM|yyyy|z|h|a|EEEEEE|d|h a|yyyy-MM-dd/g,
    (matched) => map[matched]
  );
};

export const isToday = (someDate: Date) => {
  const today: Date = new Date();
  return (
    someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
  );
};

export const isAfter = (dateA: Date, dateB: Date) => dateA > dateB;
export const isBefore = (dateA: Date, dateB: Date) => dateA < dateB;
export const isSameDay = (dateA: Date, dateB: Date) => dateA === dateB;

export const startOfDay = (date: Date): Date => {
  const result: Date = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

export const endOfDay = (date: Date): Date => {
  const result: Date = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};

export const differenceInMinutes = (date1: Date, date2: Date): number => {
  const diff: number = date1.getTime() - date2.getTime();
  return Math.floor(diff / (1000 * 60));
};

export const eachHourOfInterval = ({
  start,
  end,
}: {
  start: Date;
  end: Date;
}): Date[] => {
  const hours: Date[] = [];
  const current: Date = new Date(start);

  while (current <= end) {
    hours.push(new Date(current));
    current.setHours(current.getHours() + 1);
  }
  return hours;
};

export const eachDayOfInterval = (interval: { start: Date; end: Date }): Date[] => {
  const { start, end } = interval;
  const days: Date[] = [];
  const current = new Date(start);
  while (current <= end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return days;
};

export const startOfMonth = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), 1);

export const endOfMonth = (date = new Date()) =>
  new Date(date.getFullYear(), date.getMonth() + 1, 0);

export const daysInMonth = (year: number, month: number) =>
  new Date(year, month, 0).getDate();

export function getDaysInMonth(month: number, year: number) {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}
// const startOfWeek = (date: Date, weekStartsOn: number = 0): Date => {
//   const result = new Date(date);
//   const day = result.getDay();
//   const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
//   result.setDate(result.getDate() - diff);
//   return startOfDay(result);
// };

// const endOfWeek = (date: Date, weekStartsOn: number = 0): Date => {
//   const result = new Date(date);
//   const day = result.getDay();
//   const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
//   result.setDate(result.getDate() + (6 - diff));
//   return endOfDay(result);
// };

// const formatDate = (date: Date, format: string): string => {
//   const map: { [key: string]: string } = {
//     dd: ('0' + date.getDate()).slice(-2),
//     MMMM: date.toLocaleString('default', { month: 'long' }),
//     MMM: date.toLocaleString('default', { month: 'short' }),
//     yyyy: date.getFullYear().toString(),
//     z: date.toString().match(/\(([A-Za-z\s].*)\)/)?.[1] || '',
//     h: (date.getHours() % 12 || 12).toString(),
//     a: date.getHours() < 12 ? 'AM' : 'PM',
//   };

//   return format.replace(/dd|MMMM|MMM|yyyy|z|h|a/g, (matched) => map[matched]);
// };

// export const startOfDay = (date: Date): Date => {
//   const result = new Date(date);
//   result.setHours(0, 0, 0, 0);
//   return result;
// };

// export const endOfDay = (date: Date): Date => {
//   const result = new Date(date);
//   result.setHours(23, 59, 59, 999);
//   return result;
// };

// const eachHourOfInterval = ({ start, end }: { start: Date; end: Date }): Date[] => {
//   const hours = [];
//   const current = new Date(start);

//   while (current <= end) {
//     hours.push(new Date(current));
//     current.setHours(current.getHours() + 1);
//   }

//   return hours;
// };

// const isWithin = ({ date }, { startDate, endDate }) => {};
