import { SvgIcon, SvgIconProps } from '@mui/material';

/* eslint-disable-next-line */
export interface DownloadIconProps extends SvgIconProps {}

export function DownloadIcon(props: DownloadIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0.5 16 14">
      <path d="M0 9.05556H1.6V12.9444H14.4V9.05556H16V12.9444C16 13.8078 15.288 14.5 14.4 14.5H1.6C1.17565 14.5 0.768687 14.3361 0.468629 14.0444C0.168571 13.7527 0 13.357 0 12.9444V9.05556ZM8 10.6111L12.44 6.36444L11.304 5.26778L8.8 7.69444V0.5H7.2V7.69444L4.704 5.26778L3.568 6.37222L8 10.6111Z" />
    </SvgIcon>
  );
}

export default DownloadIcon;
