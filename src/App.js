// HSK Review Application
// a flashcard system for reviewing HSK vocabulary

import React from 'react';
// styled-components
import styled from 'styled-components';
import {createGlobalStyle} from 'styled-components'
import MetaTags from 'react-meta-tags';
// redux
import {Provider} from 'react-redux'
import store from "./redux/store";
import ResponsiveTheme from './components/ResponsiveTheme.jsx'
import Layout from './components/Layout.jsx'

function App() {
  return (<AppWrapper>
    {/* styled-components global style */}
    <GlobalStyle/>
    <MetaTags>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
      <title>HSK Review</title>
    </MetaTags>
    {/* redux provider */}
    <Provider store={store}>
      {/* responsive theme provider */}
      <ResponsiveTheme>
        <Layout></Layout>
      </ResponsiveTheme>
    </Provider>
  </AppWrapper>);
}
const AppWrapper = styled.div `
`;

const GlobalStyle = createGlobalStyle `
*,
*::after,
*::before {
    margin: 0;
    padding: 0;
    box-sizing: inherit;
    // remove ugly tap highlighting for touch devices
    -webkit-tap-highlight-color: rgba(0,0,0,0);
}

/* UNIVERSAL */

body,
html {
    height: 100%;
    width: 100%;
    max-width: 1400px;
    margin: 0;
    padding: 0;
    left: 0;
    top: 0;
}

html {
    font-size: 62.5% !important;
}

body {
    box-sizing: border-box;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: white;
    overflow: scroll;
}
`

export default App;
