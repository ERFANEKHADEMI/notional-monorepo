import { useTheme } from '@mui/material';

/* eslint-disable-next-line */
export interface NotionalLogoProps {
  height?: string;
  className?: string;
}

export function NotionalLogo({
  height = '22px',
  className = '',
  ...rest
}: NotionalLogoProps) {
  const theme = useTheme();
  const fontColor = theme?.palette.common.black;

  return (
    <svg
      width="110px"
      height={height}
      viewBox="0 0 139 22"
      fill="none"
      className={className}
      {...rest}
      xmlns="http://www.w3.org/2000/svg"
      aria-labelledby="logo"
    >
      <title id="logo">Notional Finance</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.4926 0H19.5387V19.376L21.4926 21.3299V0Z"
        fill="#21B9BA"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.5849 0H15.631V15.4683L17.5849 17.4221V0Z"
        fill="#21B9BA"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.6774 0H11.7235V11.5605L13.6774 13.5144V0Z"
        fill="#21B9BA"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.81506 7.73413V21.3298H9.76893V9.688L7.81506 7.73413Z"
        fill="#33F8FF"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.90881 3.82617V21.3301H5.86268V5.78004L3.90881 3.82617Z"
        fill="#33F8FF"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.0820221 0H0V21.3297H1.95387V1.87185L0.0820221 0Z"
        fill="#33F8FF"
      />
      <path
        fill={fontColor}
        d="M35.6235 8.16936H38.773V10.281H38.8282C39.1229 9.62281 39.6294 9.04692 40.3477 8.55329C41.0844 8.04139 41.95 7.78543 42.9446 7.78543C43.8102 7.78543 44.5469 7.94083 45.1547 8.25163C45.7809 8.54415 46.2874 8.93722 46.6742 9.43085C47.0794 9.92447 47.374 10.4912 47.5582 11.1311C47.7424 11.771 47.8345 12.4292 47.8345 13.1056V21.3327H44.5193V14.038C44.5193 13.6541 44.4917 13.2519 44.4364 12.8314C44.3812 12.4109 44.2615 12.0361 44.0773 11.707C43.8931 11.3596 43.6352 11.0763 43.3037 10.8569C42.9906 10.6375 42.567 10.5278 42.0329 10.5278C41.4988 10.5278 41.0383 10.6375 40.6516 10.8569C40.2648 11.058 39.9425 11.3231 39.6846 11.6522C39.4452 11.9812 39.261 12.3652 39.1321 12.8039C39.0032 13.2244 38.9387 13.6541 38.9387 14.0928V21.3327H35.6235V8.16936Z"
      />
      <path
        fill={fontColor}
        d="M51.2058 14.6962C51.2058 13.6541 51.39 12.7125 51.7583 11.8715C52.1451 11.0123 52.6608 10.281 53.3054 9.67766C53.95 9.07434 54.7144 8.60814 55.5984 8.27906C56.4825 7.94997 57.4218 7.78543 58.4163 7.78543C59.4109 7.78543 60.3502 7.94997 61.2343 8.27906C62.1183 8.60814 62.8826 9.07434 63.5273 9.67766C64.1719 10.281 64.6784 11.0123 65.0467 11.8715C65.4335 12.7125 65.6269 13.6541 65.6269 14.6962C65.6269 15.7383 65.4335 16.6889 65.0467 17.5482C64.6784 18.4075 64.1719 19.1479 63.5273 19.7695C62.8826 20.3728 62.1183 20.8482 61.2343 21.1955C60.3502 21.5429 59.4109 21.7166 58.4163 21.7166C57.4218 21.7166 56.4825 21.5429 55.5984 21.1955C54.7144 20.8482 53.95 20.3728 53.3054 19.7695C52.6608 19.1479 52.1451 18.4075 51.7583 17.5482C51.39 16.6889 51.2058 15.7383 51.2058 14.6962ZM54.5762 14.6962C54.5762 15.2081 54.6499 15.72 54.7973 16.2319C54.963 16.7438 55.2024 17.2008 55.5155 17.6031C55.8286 18.0053 56.2246 18.3344 56.7035 18.5903C57.1824 18.8463 57.7533 18.9742 58.4163 18.9742C59.0794 18.9742 59.6503 18.8463 60.1292 18.5903C60.608 18.3344 61.004 18.0053 61.3171 17.6031C61.6302 17.2008 61.8605 16.7438 62.0078 16.2319C62.1736 15.72 62.2564 15.2081 62.2564 14.6962C62.2564 14.1843 62.1736 13.6815 62.0078 13.1879C61.8605 12.676 61.6302 12.2189 61.3171 11.8167C61.004 11.4145 60.608 11.0945 60.1292 10.8569C59.6503 10.6009 59.0794 10.4729 58.4163 10.4729C57.7533 10.4729 57.1824 10.6009 56.7035 10.8569C56.2246 11.0945 55.8286 11.4145 55.5155 11.8167C55.2024 12.2189 54.963 12.676 54.7973 13.1879C54.6499 13.6815 54.5762 14.1843 54.5762 14.6962Z"
      />
      <path
        fill={fontColor}
        d="M67.2113 10.802V8.16936H69.5319V4.35749H72.7919V8.16936H76.1071V10.802H72.7919V16.9175C72.7919 17.5025 72.8932 17.987 73.0958 18.3709C73.3168 18.7549 73.7956 18.9468 74.5324 18.9468C74.7534 18.9468 74.9928 18.9285 75.2507 18.892C75.5085 18.8371 75.7387 18.764 75.9413 18.6726L76.0518 21.2504C75.7571 21.3601 75.4072 21.4424 75.002 21.4972C74.5968 21.5703 74.21 21.6069 73.8417 21.6069C72.9576 21.6069 72.2393 21.4881 71.6868 21.2504C71.1343 20.9944 70.6923 20.6562 70.3607 20.2357C70.0476 19.7969 69.8266 19.3033 69.6977 18.7549C69.5872 18.1881 69.5319 17.5848 69.5319 16.9449V10.802H67.2113Z"
      />
      <path
        fill={fontColor}
        d="M78.8378 8.16936H82.153V21.3327H78.8378V8.16936ZM78.3681 3.69933C78.3681 3.16914 78.5615 2.71208 78.9483 2.32815C79.3535 1.92594 79.86 1.72483 80.4678 1.72483C81.0755 1.72483 81.582 1.91679 81.9872 2.30072C82.4108 2.66637 82.6226 3.13257 82.6226 3.69933C82.6226 4.26608 82.4108 4.74142 81.9872 5.12535C81.582 5.491 81.0755 5.67382 80.4678 5.67382C79.86 5.67382 79.3535 5.48186 78.9483 5.09793C78.5615 4.69571 78.3681 4.22951 78.3681 3.69933Z"
      />
      <path
        fill={fontColor}
        d="M85.6775 14.6962C85.6775 13.6541 85.8617 12.7125 86.2301 11.8715C86.6168 11.0123 87.1325 10.281 87.7772 9.67766C88.4218 9.07434 89.1861 8.60814 90.0702 8.27906C90.9542 7.94997 91.8935 7.78543 92.8881 7.78543C93.8826 7.78543 94.8219 7.94997 95.706 8.27906C96.59 8.60814 97.3544 9.07434 97.999 9.67766C98.6436 10.281 99.1501 11.0123 99.5185 11.8715C99.9052 12.7125 100.099 13.6541 100.099 14.6962C100.099 15.7383 99.9052 16.6889 99.5185 17.5482C99.1501 18.4075 98.6436 19.1479 97.999 19.7695C97.3544 20.3728 96.59 20.8482 95.706 21.1955C94.8219 21.5429 93.8826 21.7166 92.8881 21.7166C91.8935 21.7166 90.9542 21.5429 90.0702 21.1955C89.1861 20.8482 88.4218 20.3728 87.7772 19.7695C87.1325 19.1479 86.6168 18.4075 86.2301 17.5482C85.8617 16.6889 85.6775 15.7383 85.6775 14.6962ZM89.048 14.6962C89.048 15.2081 89.1217 15.72 89.269 16.2319C89.4348 16.7438 89.6742 17.2008 89.9873 17.6031C90.3004 18.0053 90.6964 18.3344 91.1752 18.5903C91.6541 18.8463 92.225 18.9742 92.8881 18.9742C93.5511 18.9742 94.1221 18.8463 94.6009 18.5903C95.0798 18.3344 95.4758 18.0053 95.7889 17.6031C96.102 17.2008 96.3322 16.7438 96.4795 16.2319C96.6453 15.72 96.7282 15.2081 96.7282 14.6962C96.7282 14.1843 96.6453 13.6815 96.4795 13.1879C96.3322 12.676 96.102 12.2189 95.7889 11.8167C95.4758 11.4145 95.0798 11.0945 94.6009 10.8569C94.1221 10.6009 93.5511 10.4729 92.8881 10.4729C92.225 10.4729 91.6541 10.6009 91.1752 10.8569C90.6964 11.0945 90.3004 11.4145 89.9873 11.8167C89.6742 12.2189 89.4348 12.676 89.269 13.1879C89.1217 13.6815 89.048 14.1843 89.048 14.6962Z"
      />
      <path
        fill={fontColor}
        d="M103.589 8.16936H106.739V10.281H106.794C107.089 9.62281 107.595 9.04692 108.313 8.55329C109.05 8.04139 109.916 7.78543 110.91 7.78543C111.776 7.78543 112.513 7.94083 113.12 8.25163C113.747 8.54415 114.253 8.93722 114.64 9.43085C115.045 9.92447 115.34 10.4912 115.524 11.1311C115.708 11.771 115.8 12.4292 115.8 13.1056V21.3327H112.485V14.038C112.485 13.6541 112.457 13.2519 112.402 12.8314C112.347 12.4109 112.227 12.0361 112.043 11.707C111.859 11.3596 111.601 11.0763 111.269 10.8569C110.956 10.6375 110.533 10.5278 109.999 10.5278C109.465 10.5278 109.004 10.6375 108.617 10.8569C108.231 11.058 107.908 11.3231 107.65 11.6522C107.411 11.9812 107.227 12.3652 107.098 12.8039C106.969 13.2244 106.904 13.6541 106.904 14.0928V21.3327H103.589V8.16936Z"
      />
      <path
        fill={fontColor}
        d="M128.178 19.6598H128.095C127.763 20.2449 127.229 20.7293 126.493 21.1133C125.756 21.4789 124.918 21.6617 123.979 21.6617C123.444 21.6617 122.883 21.5886 122.293 21.4424C121.722 21.3144 121.188 21.095 120.691 20.7842C120.212 20.4551 119.807 20.0346 119.475 19.5227C119.162 18.9925 119.006 18.3435 119.006 17.5756C119.006 16.5884 119.282 15.8022 119.835 15.2172C120.406 14.6322 121.133 14.1843 122.017 13.8735C122.901 13.5627 123.877 13.3616 124.945 13.2701C126.032 13.1604 127.091 13.1056 128.123 13.1056V12.7765C128.123 11.9538 127.819 11.3505 127.211 10.9666C126.622 10.5644 125.912 10.3632 125.084 10.3632C124.384 10.3632 123.712 10.5095 123.067 10.802C122.422 11.0945 121.888 11.451 121.465 11.8715L119.752 9.86962C120.507 9.17489 121.372 8.65384 122.349 8.30648C123.343 7.95912 124.347 7.78543 125.36 7.78543C126.539 7.78543 127.506 7.94997 128.261 8.27906C129.034 8.60814 129.642 9.03777 130.084 9.56796C130.526 10.0982 130.83 10.6923 130.996 11.3505C131.18 12.0087 131.272 12.6668 131.272 13.325V21.3327H128.178V19.6598ZM128.123 15.3269H127.377C126.843 15.3269 126.281 15.3543 125.691 15.4092C125.102 15.4457 124.559 15.5463 124.061 15.7108C123.564 15.8571 123.15 16.0765 122.818 16.369C122.487 16.6432 122.321 17.0272 122.321 17.5208C122.321 17.8316 122.385 18.0967 122.514 18.3161C122.662 18.5172 122.846 18.6817 123.067 18.8097C123.288 18.9377 123.537 19.0291 123.813 19.0839C124.089 19.1388 124.365 19.1662 124.642 19.1662C125.784 19.1662 126.649 18.8645 127.239 18.2612C127.828 17.6579 128.123 16.8352 128.123 15.7931V15.3269Z"
        className="logo-text"
      />
      <path
        fill={fontColor}
        d="M135.466 0.600464H138.781V21.3327H135.466V0.600464Z"
      />
    </svg>
  );
}

export default NotionalLogo;
