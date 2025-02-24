import { SvgIcon, SvgIconProps } from '@mui/material';

/* eslint-disable-next-line */
export interface ChfIconProps extends SvgIconProps {}

export function ChfIcon(props: ChfIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 14 14">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 46 46">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M23 46C35.7025 46 46 35.7025 46 23C46 10.2975 35.7025 0 23 0C10.2975 0 0 10.2975 0 23C0 35.7025 10.2975 46 23 46ZM20.1548 10C19.346 10 18.6904 10.6433 18.6904 11.4369V28.1466H14.4644C13.6557 28.1466 13 28.79 13 29.5836C13 30.3772 13.6557 31.0205 14.4644 31.0205H18.6904V36.563C18.6904 37.3567 19.346 38 20.1548 38C20.9636 38 21.6192 37.3567 21.6192 36.563V31.0205H27.2678C28.0766 31.0205 28.7322 30.3772 28.7322 29.5836C28.7322 28.79 28.0766 28.1466 27.2678 28.1466H21.6192V21.9472H30.113C30.9218 21.9472 31.5774 21.3039 31.5774 20.5103C31.5774 19.7167 30.9218 19.0733 30.113 19.0733H21.6192V12.8739H31.5356C32.3443 12.8739 33 12.2306 33 11.4369C33 10.6433 32.3443 10 31.5356 10H20.1548Z"
        />
      </svg>
    </SvgIcon>
  );
}

export default ChfIcon;
