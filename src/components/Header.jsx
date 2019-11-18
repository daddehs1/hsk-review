// Header component
// displays the page header

import React from 'react';
import styled from 'styled-components';

const TitleBox = styled.div `
  display: flex;
  align-items: center;
  margin: 0 2rem;
`

const TitleText = styled.div `
font-size: calc(2.2 * ${props => props.theme.baseFontSize});
font-weight: bold;
`

function Header() {
  return (<TitleBox>
    <TitleText>
      HSK Review
    </TitleText>
  </TitleBox>);
}

export default Header;
