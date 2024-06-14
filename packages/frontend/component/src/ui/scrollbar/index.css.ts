import { cssVar } from '@toeverything/theme';
import { globalStyle, style } from '@vanilla-extract/css';
export const scrollableContainerRoot = style({
  width: '100%',
  vars: {
    '--scrollbar-width': '8px',
  },
  height: '100%',
  overflowY: 'hidden',
});
export const scrollTopBorder = style({
  position: 'absolute',
  top: 0,
  left: '16px',
  right: '16px',
  height: '1px',
  transition: 'opacity .3s .2s',
  opacity: 0,
  background: cssVar('borderColor'),
  selectors: {
    '&[data-has-scroll-top="true"]': {
      opacity: 1,
    },
  },
});
export const scrollableViewport = style({
  height: '100%',
  width: '100%',
});
globalStyle(`${scrollableViewport} >:first-child`, {
  display: 'contents !important',
});
export const scrollableContainer = style({
  height: '100%',
});
export const scrollbar = style({
  display: 'flex',
  flexDirection: 'column',
  userSelect: 'none',
  touchAction: 'none',
  width: 'var(--scrollbar-width)',
  height: '100%',
  opacity: 1,
  transition: 'width .15s',
  ':hover': {
    background: cssVar('backgroundSecondaryColor'),
    width: 'calc(var(--scrollbar-width) + 3px)',
    borderLeft: `1px solid ${cssVar('borderColor')}`,
  },
  selectors: {
    '&[data-state="hidden"]': {
      opacity: 0,
    },
  },
});
export const TableScrollbar = style({
  marginTop: '60px',
  height: 'calc(100% - 120px)',
  borderRadius: '4px',
});
export const scrollbarThumb = style({
  position: 'relative',
  background: cssVar('dividerColor'),
  width: '50%',
  overflow: 'hidden',
  borderRadius: '4px',
  ':hover': {
    background: cssVar('iconColor'),
  },
  selectors: {
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '100%',
      height: '100%',
      minWidth: '44px',
      minHeight: '44px',
    },
  },
});
