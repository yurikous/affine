import clsx from 'clsx';
import type { BaseSyntheticEvent } from 'react';
import { forwardRef } from 'react';

import * as styles from './list.css';
import type { ColWrapperProps } from './types';

export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  );
}

export function isLastWeek(date: Date): boolean {
  const today = new Date();
  const lastWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 7
  );
  return date >= lastWeek && date < today;
}

export function isLastMonth(date: Date): boolean {
  const today = new Date();
  const lastMonth = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    today.getDate()
  );
  return date >= lastMonth && date < today;
}

export function isLastYear(date: Date): boolean {
  const today = new Date();
  const lastYear = new Date(
    today.getFullYear() - 1,
    today.getMonth(),
    today.getDate()
  );
  return date >= lastYear && date < today;
}

export const formatDate = (date: Date): string => {
  // yyyy-mm-dd MM-DD HH:mm
  // const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  if (isToday(date)) {
    // HH:mm
    return `${hours}:${minutes}`;
  }
  // MM-DD HH:mm
  return `${month}-${day} ${hours}:${minutes}`;
};

export const ColWrapper = forwardRef<HTMLDivElement, ColWrapperProps>(
  function ColWrapper(
    {
      flex,
      alignment,
      hideInSmallContainer,
      hidden,
      className,
      style,
      children,
      ...rest
    }: ColWrapperProps,
    ref
  ) {
    return (
      <div
        {...rest}
        ref={ref}
        data-testid="page-list-flex-wrapper"
        style={{
          ...style,
          flexGrow: flex,
          flexBasis: flex ? `${(flex / 12) * 100}%` : 'auto',
          justifyContent: alignment,
        }}
        data-hide-item={hideInSmallContainer ? true : undefined}
        className={clsx(className, styles.colWrapper, {
          [styles.hidden]: hidden,
          [styles.hideInSmallContainer]: hideInSmallContainer,
        })}
      >
        {children}
      </div>
    );
  }
);

export const withinDaysAgo = (date: Date, days: number): boolean => {
  const startDate = new Date();
  const day = startDate.getDate();
  const month = startDate.getMonth();
  const year = startDate.getFullYear();
  return new Date(year, month, day - days + 1) <= date;
};

export const betweenDaysAgo = (
  date: Date,
  days0: number,
  days1: number
): boolean => {
  return !withinDaysAgo(date, days0) && withinDaysAgo(date, days1);
};

export function stopPropagation(event: BaseSyntheticEvent) {
  event.stopPropagation();
  event.preventDefault();
}
export function stopPropagationWithoutPrevent(event: BaseSyntheticEvent) {
  event.stopPropagation();
}

// credit: https://github.com/facebook/fbjs/blob/main/packages/fbjs/src/core/shallowEqual.js
export function shallowEqual(objA: any, objB: any) {
  if (Object.is(objA, objB)) {
    return true;
  }

  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  for (const key of keysA) {
    if (
      !Object.prototype.hasOwnProperty.call(objB, key) ||
      !Object.is(objA[key], objB[key])
    ) {
      return false;
    }
  }

  return true;
}
