// NOT IN USE - discard it later

export interface parts {
  yyyy: number;
  MM: string;
  dd: string;
  HH: string;
  hh: string;
  mm: string;
  ss: string;
  tt: string;
}

export const isToday = (someDate: Date) => {
  const today = new Date();
  return (
    someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
  );
};

export const startOfDay = (date: Date) => {
  date.setUTCHours(0, 0, 0, 0);
  return date;
};

export const startOfToday = () => {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  return date;
};
export const endOfDay = (date: Date) => {
  date.setUTCHours(23, 59, 59, 999);
  return date;
};

export const endOfToday = () => {
  const date = new Date();
  date.setUTCHours(23, 59, 59, 999);
  return date;
};

// const now = new Date();
// const delay = 60 * 60 * 1000; // 1 hour in msec
// let start =
//   delay - (now.getMinutes() * 60 + now.getSeconds()) * 1000 + now.getMilliseconds();

// setTimeout(function doSomething() {
//   // do the operation

//   // schedule the next tick
//   setTimeout(doSomething, delay);
// }, start);

export const eachHourOfInterval = (dt2: Date, dt1: Date) => {
  dt2 = new Date();
  dt1 = new Date();
  let diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60 * 60;
  return Math.abs(Math.round(diff));
};

export function startOfWeek(date: Date) {
  let diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);

  return new Date(date.setDate(diff));
}

export function endOfWeek(date: Date) {
  let lastday = date.getDate() - (date.getDay() - 1) + 6;
  return new Date(date.setDate(lastday));
}

// const monthStart = new Date(new Date(new Date().getFullYear(), new Date().getMonth(), 1).setHours(0, 0, 0, 0))
// const monthEnd = new Date(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).setHours(23, 59, 59, 999))

export function getDatesInterval(from_date: Date, to_date: Date) {
  const current_date = new Date(from_date);
  const end_date = new Date(to_date);

  const getTimeDiff = Math.abs(current_date.getTime() - end_date.getTime());
  const date_range = Math.ceil(getTimeDiff / (1000 * 3600 * 24)) + 1;

  const weekday = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const months = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ];
  const dates = new Array();

  // {
  //   row_date: {
  //     day: string | number;
  //     month: string;
  //     year: number;
  //   };
  //   fmt_date: {
  //     weekDay: string;
  //     date: string | number;
  //     month: string;
  //   };
  //   is_weekend: boolean;
  // }[]

  for (let i = 0; i <= date_range; i++) {
    let getDate,
      getMonth = '';

    if (current_date.getDate() < 10) {
      getDate = '0' + current_date.getDate();
    } else {
      getDate = current_date.getDate();
    }

    if (current_date.getMonth() < 9) {
      getMonth = '0' + (current_date.getMonth() + 1);
    } else {
      getMonth = current_date.getMonth().toString();
    }

    let row_date = {
      day: getDate,
      month: getMonth,
      year: current_date.getFullYear(),
    };
    let fmt_date = {
      weekDay: weekday[current_date.getDay()],
      date: getDate,
      month: months[current_date.getMonth()],
    };
    let is_weekend = false;
    if (current_date.getDay() == 0 || current_date.getDay() == 6) {
      is_weekend = true;
    }
    dates.push({ row_date: row_date, fmt_date: fmt_date, is_weekend: is_weekend });
    current_date.setDate(current_date.getDate() + 1);
  }
  return dates;
}

// export const formatDate = (inputDate: Date, format: string) => {
//   if (!inputDate) return '';

//   const padZero = (value: number) => (value < 10 ? `0${value}` : `${value}`);
//   const parts: parts = {
//     yyyy: inputDate.getFullYear(),
//     MM: padZero(inputDate.getMonth() + 1),
//     dd: padZero(inputDate.getDate()),
//     HH: padZero(inputDate.getHours()),
//     hh: padZero(
//       inputDate.getHours() > 12 ? inputDate.getHours() - 12 : inputDate.getHours()
//     ),
//     mm: padZero(inputDate.getMinutes()),
//     ss: padZero(inputDate.getSeconds()),
//     tt: inputDate.getHours() < 12 ? 'AM' : 'PM',
//   };

//   return format.replace(/yyyy|MM|dd|HH|hh|mm|ss|tt/g, (match) => parts[match]);
// };

export const differenceInMinutes = (date1: Date, date2: Date) => {
  const current_date = new Date(date1);
  const end_date = new Date(date2);
  const diffMs = current_date.getTime() - end_date.getTime(); // milliseconds between date1 & date2
  const diffDays = Math.floor(diffMs / 86400000); // days
  const diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
  const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

  console.log(diffDays + ' days, ' + diffHrs + ' hours, ' + diffMins + ' minutes');
  return diffMins;
};

export const add = (date: Date, unit: string, amount: number) => {
  if (!(date instanceof Date) || typeof amount !== 'number') return date;

  const newDate = new Date(date);

  switch (unit) {
    case 'milliseconds':
      newDate.setMilliseconds(newDate.getMilliseconds() + amount);
      break;
    case 'seconds':
      newDate.setSeconds(newDate.getSeconds() + amount);
      break;
    case 'minutes':
      newDate.setMinutes(newDate.getMinutes() + amount);
      break;
    case 'hours':
      newDate.setHours(newDate.getHours() + amount);
      break;
    case 'days':
      newDate.setDate(newDate.getDate() + amount);
      break;
    case 'weeks':
      newDate.setDate(newDate.getDate() + 7 + amount);
      break;
    case 'months':
      newDate.setMonth(newDate.getMonth() + amount);
      break;
    case 'years':
      newDate.setFullYear(newDate.getFullYear() + amount);
      break;
  }

  return newDate;
};

export const sub = (date: Date, unit: string, amount: number) => {
  if (!(date instanceof Date) || typeof amount !== 'number') return date;

  const newDate = new Date(date);

  switch (unit) {
    case 'milliseconds':
      newDate.setMilliseconds(newDate.getMilliseconds() - amount);
      break;
    case 'seconds':
      newDate.setSeconds(newDate.getSeconds() - amount);
      break;
    case 'minutes':
      newDate.setMinutes(newDate.getMinutes() - amount);
      break;
    case 'hours':
      newDate.setHours(newDate.getHours() - amount);
      break;
    case 'days':
      newDate.setDate(newDate.getDate() - amount);
      break;
    case 'weeks':
      newDate.setDate(newDate.getDate() - 7 - amount);
      break;
    case 'months':
      newDate.setMonth(newDate.getMonth() - amount);
      break;
    case 'years':
      newDate.setFullYear(newDate.getFullYear() - amount);
      break;
  }

  return newDate;
};

export const isAfter = (dateA: Date, dateB: Date) => dateA > dateB;
export const isBefore = (dateA: Date, dateB: Date) => dateA < dateB;
export const isSameDay = (dateA: Date, dateB: Date) => dateA === dateB;
