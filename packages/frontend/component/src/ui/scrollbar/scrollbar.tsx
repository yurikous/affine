import * as ScrollArea from '@radix-ui/react-scroll-area';
import clsx from 'clsx';
import type { PropsWithChildren } from 'react';
import { useRef } from 'react';

import * as styles from './index.css';
import { useHasScrollTop } from './use-has-scroll-top';

export type ScrollableContainerProps = {
  showScrollTopBorder?: boolean;
  inTableView?: boolean;
  className?: string;
  viewPortClassName?: string;
  styles?: React.CSSProperties;
  scrollBarClassName?: string;
};

export const ScrollableContainer = ({
  children,
  showScrollTopBorder = false,
  inTableView = false,
  className,
  styles: _styles,
  viewPortClassName,
  scrollBarClassName,
}: PropsWithChildren<ScrollableContainerProps>) => {
  const ref = useRef<HTMLDivElement>(null);
  const hasScrollTop = useHasScrollTop(ref);
  return (
    <ScrollArea.Root
      style={_styles}
      className={clsx(styles.scrollableContainerRoot, className)}
    >
      <div
        data-has-scroll-top={hasScrollTop}
        className={clsx({ [styles.scrollTopBorder]: showScrollTopBorder })}
      />
      <ScrollArea.Viewport
        className={clsx([styles.scrollableViewport, viewPortClassName])}
        ref={ref}
      >
        <div className={styles.scrollableContainer}>{children}</div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        orientation="vertical"
        className={clsx(styles.scrollbar, scrollBarClassName, {
          [styles.TableScrollbar]: inTableView,
        })}
      >
        <ScrollArea.Thumb className={styles.scrollbarThumb} />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
};
