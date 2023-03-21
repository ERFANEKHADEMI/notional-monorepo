import { SvgIcon, SvgIconProps } from '@mui/material';

/* eslint-disable-next-line */
export interface DuneIcon extends SvgIconProps {}

export function DuneIcon(props: DuneIcon) {
  return (
    <SvgIcon {...props} viewBox="0 0 21 21">
      <svg
        width="21"
        height="21"
        viewBox="0 0 21 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="10.5"
          cy="10.5"
          r="10.35"
          stroke="#013D4A"
          stroke-width="0.3"
        />
        <path
          d="M21.0032 10.5005C21.0032 16.2994 16.3022 21.0005 10.5032 21.0005C6.90895 21.0005 3.7365 19.1945 1.84375 16.4406L20.9932 10.0381C20.9998 10.1914 21.0032 10.3455 21.0032 10.5005Z"
          fill="#013D4A"
        />
      </svg>
    </SvgIcon>
  );
}

export default DuneIcon;
