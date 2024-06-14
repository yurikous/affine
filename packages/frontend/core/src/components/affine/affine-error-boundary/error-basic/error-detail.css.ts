import { style } from '@vanilla-extract/css';
export const errorLayout = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  width: '100%',
  gap: '20px',
});
export const errorDetailStyle = style({
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '420px',
});
export const errorTitle = style({
  fontSize: '32px',
  lineHeight: '44px',
  fontWeight: 700,
});
export const errorImage = style({
  height: '178px',
  maxWidth: '400px',
  flexGrow: 1,
  backgroundSize: 'cover',
});
export const errorDescription = style({
  marginTop: '24px',
});
export const errorFooter = style({
  marginTop: '24px',
});
export const errorDivider = style({
  width: '20px',
  height: '100%',
});
