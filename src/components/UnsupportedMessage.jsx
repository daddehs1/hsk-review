// UnsupportedMessage component
// a component containing a message displayed to user in unsupported conditions

import React from 'react';
import styled from 'styled-components'

function UnsupportedMessage() {
  return <UnsupportedMessageWrapper>Sorry, this application is not optimized for landscape view on mobile.</UnsupportedMessageWrapper>
}

const UnsupportedMessageWrapper = styled.div `
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: calc(1.6 * ${props => props.theme.baseFontSize})
`

export default UnsupportedMessage;
