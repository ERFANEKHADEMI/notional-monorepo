import { SvgIcon, SvgIconProps } from '@mui/material';

/* eslint-disable-next-line */
export interface GbpIconProps extends SvgIconProps {}

export function GbpIcon(props: GbpIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 14 14">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 46 46">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M23 46C35.7025 46 46 35.7025 46 23C46 10.2975 35.7025 0 23 0C10.2975 0 0 10.2975 0 23C0 35.7025 10.2975 46 23 46ZM32.2366 10.4929C29.7557 9.49768 27.2748 9 24.7939 9C22.1349 9 20.0738 9.6615 18.6107 10.9845C17.1603 12.2954 16.4351 14.1707 16.4351 16.6103V20.1605H13.0382V24.1477H16.4351V26.7876C16.4351 28.0013 16.187 28.9541 15.6908 29.646C15.2074 30.3378 14.3104 30.9508 13 31.4848V36H33V31.2663H19.2977C21.2188 30.3196 22.1794 28.8146 22.1794 26.7512V24.1477H29.3359V20.1605H22.1794V16.6466C22.1794 15.6393 22.4466 14.8685 22.9809 14.3344C23.5153 13.7883 24.2786 13.5151 25.271 13.5151C26.7341 13.5152 28.4644 13.9036 30.4618 14.6804L32.2366 10.4929Z"
        />
      </svg>
    </SvgIcon>
  );
}

export default GbpIcon;
