import { getI18n } from '@affine/i18n';
import dayjs from 'dayjs';

function createTimeFormatter() {
  return new Intl.DateTimeFormat(getI18n()?.language, {
    timeStyle: 'short',
  });
}

function createDateFormatter() {
  return new Intl.DateTimeFormat(getI18n()?.language, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function createWeekFormatter() {
  return new Intl.DateTimeFormat(getI18n()?.language, {
    weekday: 'long',
  });
}

export const timestampToLocalTime = (ts: string | number) => {
  const formatter = createTimeFormatter();
  return formatter.format(dayjs(ts).toDate());
};

export const timestampToLocalDate = (ts: string | number) => {
  const formatter = createDateFormatter();
  return formatter.format(dayjs(ts).toDate());
};

export interface CalendarTranslation {
  yesterday: () => string;
  today: () => string;
  tomorrow: () => string;
  nextWeek: () => string;
}

export const timestampToCalendarDate = (
  ts: string | number,
  translation: CalendarTranslation,
  referenceTime?: string | number
) => {
  const startOfDay = dayjs(referenceTime).startOf('d');
  const diff = dayjs(ts).diff(startOfDay, 'd', true);
  const sameElse = timestampToLocalDate(ts);

  const formatter = createWeekFormatter();
  const week = formatter.format(dayjs(ts).toDate());

  return diff < -6
    ? sameElse
    : diff < -1
      ? week
      : diff < 0
        ? translation.yesterday()
        : diff < 1
          ? translation.today()
          : diff < 2
            ? translation.tomorrow()
            : diff < 7
              ? `${translation.nextWeek()} ${week}`
              : sameElse;
};
