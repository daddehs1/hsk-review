// Icon Button component
// a generic, reusable button component that combines a icon (feather icons) and a label
// responsive layout, removes label on mobile depending on props

import React from 'react';
import styled from 'styled-components';
//TODO: replace loading of all icons with dynamic import?
import {Eye, Check, X, ArrowRight, RotateCcw} from 'react-feather';

/**
 * FlashcardTicker component
 * @param {string} props.icon name of the react-feather icon to use
 * @param {string} props.label text to display within the button
 * @param {boolean} props.small whether this icon should remove its label on mobile devices
 * @param {Function} props.onMouseOver onMouseOver event handler, passed on to button
 * @param {Function} props.onMouseOut onMouseOut event handler, passed on to button
 * @param {Function} props.onClick onClick event handler, passed on to button
 */
function IconButton(props) {
  var Icon;
  switch (props.icon) {
    default:
    case 'eye':
      Icon = Eye
      break;
    case 'check':
      Icon = Check
      break;
    case 'x':
      Icon = X
      break;
    case 'arrow-right':
      Icon = ArrowRight
      break;
    case 'restart':
      Icon = RotateCcw
  }

  return (<IconButtonWrapper onMouseOver={props.onMouseOver} onMouseOut={props.onMouseOut} onClick={props.onClick}>
    <Icon size={'4rem'}></Icon>
    <Label small={props.small}>
      {props.label}
    </Label>
  </IconButtonWrapper>)
}

const IconButtonWrapper = styled.div `
  cursor: pointer;
  ${ ''/* background-color: rgba(255,255,255, .2); */}
  padding: .5rem 3rem;
  min-width: 30%;
  max-width: 50%;
  margin: 0 auto;
  .mq-mobile & {
    max-width: 90%;
  }

  border: .3rem solid white;
  border-radius: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease-out;
  color: white;
  `

const Label = styled.div `
  margin-left: calc(.5 * calc(1.2rem + 0.35vw));
  white-space: nowrap;
  font-size: calc(2.5 * calc(1.2rem + 0.35vw));
${ ''/* if props small is present, do not display the label in mobile */}
  .mq-mobile & {
    display: ${props => props.small
  ? "none"
  : "inherit"};
  }
`

export default IconButton;
