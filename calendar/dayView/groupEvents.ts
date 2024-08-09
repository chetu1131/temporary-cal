import { isAfter, isBefore, isSameDay } from '../DateFunctions';

import type { Event } from '../types';

export type GroupedEvents = {
  allDayEvents: Event[];
  eventGroups: Event[][];
};

const createGroups = (events: Event[], groupedEvents: Event[][] = []): Event[][] => {
  if (events.length <= 0) return groupedEvents;

  const [first, ...rest] = events;

  const eventsInRage = rest.filter(
    (event) =>
      // isWithinInterval(event.start_date, {
      //   start: first.start_date,
      //   end: add(first.end_date, ' minutes', -1),
      // })

      event
  );

  const group: Event[] = [first, ...eventsInRage];
  const sliced: Event[] = rest.slice(eventsInRage.length);
  groupedEvents.push(group);

  return createGroups(sliced, groupedEvents);
};

export const groupEvents = (date: Date, events: Event[]): GroupedEvents => {
  const eventsPresentToday = events.filter((event) => {
    const startBeforeEndToday: boolean =
      isBefore(event.start_date, date) && isSameDay(event.end_date, date);
    const startTodayEndAfter: boolean =
      isSameDay(event.start_date, date) && isAfter(event.end_date, date);
    const startTodayEndToday: boolean =
      isSameDay(event.start_date, date) && isSameDay(event.end_date, date);
    const startBeforeEndAfter: boolean =
      isBefore(event.start_date, date) && isAfter(event.end_date, date);
    return (
      startTodayEndAfter ||
      startTodayEndToday ||
      startBeforeEndToday ||
      startBeforeEndAfter
    );
  });

  const [allDayEvents, thisDayEvents]: Event[][] = eventsPresentToday.reduce(
    (acc: Event[][], cur) => {
      if (isBefore(cur.start_date, date) && isAfter(cur.end_date, date)) {
        acc[0].push(cur);
      }

      if (isSameDay(cur.start_date, date) && isSameDay(cur.end_date, date)) {
        acc[1].push(cur);
      }

      return acc;
    },
    [[], []]
  );

  const eventGroups: Event[][] = createGroups(thisDayEvents);

  return { eventGroups, allDayEvents };
};

//store it is day view or week in redux store - as per that set dat lable week lable or
