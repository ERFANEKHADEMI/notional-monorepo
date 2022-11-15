import React from 'react'
import { styled } from '@mui/material/styles'
import PropTypes from 'prop-types'

const IconSizes = {
  sm: '1rem',
  md: '2rem',
  lg: '3rem'
}

export const HelpIcon = ({ color, size }) => {
  return (
    <StyledSVG
      width={IconSizes[size]}
      height={IconSizes[size]}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        // eslint-disable-next-line max-len
        d="M2.66699 7.99935C2.66699 5.05411 5.05509 2.66602 8.00033 2.66602C10.9456 2.66602 13.3337 5.05411 13.3337 7.99935C13.3337 10.9446 10.9456 13.3327 8.00033 13.3327C5.05509 13.3327 2.66699 10.9446 2.66699 7.99935ZM3.57175 7.99935C3.57175 10.4446 5.55509 12.4279 8.00033 12.4279C10.4456 12.4279 12.4289 10.4446 12.4289 7.99935C12.4289 5.55411 10.4456 3.57078 8.00033 3.57078C5.55509 3.57078 3.57175 5.55411 3.57175 7.99935ZM7.59626 6.30817C7.4891 6.20101 7.4289 6.05566 7.4289 5.90411C7.4289 5.75256 7.4891 5.60721 7.59626 5.50005C7.70343 5.39289 7.84877 5.33268 8.00033 5.33268C8.15188 5.33268 8.29722 5.39289 8.40439 5.50005C8.51155 5.60721 8.57175 5.75256 8.57175 5.90411C8.57175 6.05566 8.51155 6.20101 8.40439 6.30817C8.29722 6.41534 8.15188 6.47554 8.00033 6.47554C7.84877 6.47554 7.70343 6.41534 7.59626 6.30817ZM7.61937 7.33268C7.61937 7.2803 7.66223 7.23744 7.71461 7.23744H8.28604C8.33842 7.23744 8.38128 7.2803 8.38128 7.33268V10.5708C8.38128 10.6232 8.33842 10.666 8.28604 10.666H7.71461C7.66223 10.666 7.61937 10.6232 7.61937 10.5708V7.33268Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill={color}
      />
    </StyledSVG>
  )
}

HelpIcon.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg'])
}

HelpIcon.defaultProps = {
  color: '#000000',
  size: 'sm'
}

const StyledSVG = styled.svg``