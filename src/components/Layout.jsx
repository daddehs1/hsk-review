// Layout component
// simple component which holds the layout for this application
// divided into 3 main sections (header, content, )
// pages are fed into content section through Router component

import React from 'react';
import styled from 'styled-components'
import Div100vh from 'react-div-100vh'
import Header from './Header.jsx'
import Router from '../router/Router.jsx'
import UnsupportedMessage from './UnsupportedMessage'

function Layout() {
  return (<LayoutWrapper>
    {/* Header */}
    <HeaderContainer>
      <Header/>
    </HeaderContainer>

    {/* Content */}
    {/* if unsuported conditions, display UnsupportedMessage */}
    <UnsupportedMessageContainer>
      <UnsupportedMessage/>
    </UnsupportedMessageContainer>
    {/* else display ContentContainer */}
    <ContentContainer>
      <Router></Router>
    </ContentContainer>

    {/* Footer */}
    <FooterContainer/>
  </LayoutWrapper>);
}

const LayoutWrapper = styled(Div100vh)`
  user-select: none;
  background-color: hsl(210, 83%, 16%);
  position: fixed;
  display: flex;
  flex-direction: column;
  height: '100rvh';
  width: 100vw;
  padding: calc(1.6 * ${props => props.theme.baseFontSize}) calc(.8 * ${props => props.theme.baseFontSize});
`
const HeaderContainer = styled.div `
  padding: calc(.25 * ${props => props.theme.baseMarginSize});
`

const UnsupportedMessageContainer = styled.div `
  ${ ''/* display content if landscape and large screen */}
  display: none;
  height: 100%;
  width: 100%;
  .mq-landscape:not(.mq-large) & {
    display: inherit;
  }
`

const ContentContainer = styled.div `
  padding: calc(.25 * ${props => props.theme.baseMarginSize});
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-wrap: wrap;

${ ''/* do not display content if landscape and large screen */}
  .mq-landscape:not(.mq-large) & {
    display: none;
  }
`
const FooterContainer = styled.div `
  height: 0%
`

export default Layout;
