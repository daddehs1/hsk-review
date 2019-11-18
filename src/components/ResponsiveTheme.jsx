// ResponsiveTheme component
// provides a styled-components theme and mediaQuery classes to children

import React from 'react';
import {ThemeProvider} from 'styled-components'
import classNames from 'classnames';
import {useMediaQuery} from 'react-responsive'

function ResponsiveTheme(props) {
  // define some properties using particular mediaQuery breakpoints and orientations
  const isLarge = useMediaQuery({minDeviceWidth: 850})
  const isMedium = useMediaQuery({minDeviceWidth: 450})
  const isSmall = useMediaQuery({minDeviceWidth: 350})
  const isTiny = !(isLarge || isMedium || isSmall);
  const isPortrait = useMediaQuery({orientation: 'portrait'})
  // create classNames from different properties
  const mediaQueryProperties = {
    'mq-large': isLarge,
    'mq-medium': isMedium,
    'mq-small': isSmall,
    'mq-tiny': isTiny,
    'mq-mobile': !isMedium,
    'mq-portrait': isPortrait,
    'mq-landscape': !isPortrait
  }

  // experimental responsive sizing
  // define base font-size
  // fine-tune based on size, then orientation, then windowHeight / windowWeight
  // can also be used for margin/padding
  var base;
  var heightBoost;
  var widthBoost;
  var checkBoxBoost = 0;

  if (isTiny) {
    base = .6
    heightBoost = .25;
    widthBoost = .25;
  }

  if (isSmall) {
    base = .7
    heightBoost = .25;
    widthBoost = .25;
  }

  if (isMedium) {
    base = .9
    if (isPortrait) {
      heightBoost = .6;
      widthBoost = .15;
      checkBoxBoost = .4;
    } else {
      heightBoost = .25;
      widthBoost = .25;
    }
  }

  if (isLarge) {
    base = 1
    if (isPortrait) {
      heightBoost = 1;
      widthBoost = .2;
      checkBoxBoost = .6;
    } else {
      heightBoost = .25;
      widthBoost = .1;
    }

  }

  // define styled-components theme
  // also include our base sizes into this theme for use in children styled-components
  var theme = {
    baseFontSize: `calc(${base}rem + ${heightBoost}vh + ${widthBoost}vw)`,
    baseMarginSize: `${base}rem`,
    checkBoxSize: `calc(1rem + 2 * ${base + checkBoxBoost}rem)`,
    colors: {
      correct: 'hsla(152, 88%, 64%, 1)',
      correctOpaque: 'hsla(152, 88%, 64%, 1)',
      correctSemiTransparent: 'hsla(151.52, 88.2%, 64.13%, .4)',
      incorrect: 'hsla(330, 80%, 54%, 1)',
      incorrectOpaque: 'hsla(330, 80%, 54%, 1)',
      incorrectSemiTransparent: 'hsl(329.85, 80.33%, 53.9%, .4)',
      white: 'rgb(255,255,255)',
      whiteSemiTransparent: 'rgba(255,255,255, .4)'
    }

  }

  return (<ThemeProvider theme={theme}>
    <div className={classNames(mediaQueryProperties)}>
      {props.children}
    </div>
  </ThemeProvider>)
}

export default ResponsiveTheme;
