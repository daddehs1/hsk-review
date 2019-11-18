// Swiper component
// a colored swiper to aid transition effects

import React from 'react';
import styled from 'styled-components';

/**
 * Swiper component
 * @param  {string} props.type the type of the swiper (Correct or Incorrect)
 * @param  {boolean} props.invisible whether this swiper should be invisble
 * @param  {string} props.position the position of the swiper (hide, peek, hide-opposite)
 */
function Swiper(props) {
  return (
    props.type === 'correct'
    ? <CorrectSwiper invisible={props.invisible} position={props.position}/>
    : <IncorrectSwiper invisible={props.invisible} position={props.position}/>)
}

// Swiper to serve as base for CorrectSwiper and IncorrectSwiper
const SwiperBase = styled.div `
  position: absolute;
  z-index: 1000;
  top: 0;
  left: 0;
  width: 200vw;
  height: 100vh;
  transition: transform ${props => props.invisible
  ? '0s'
  : '.6s ease-in-out'};
opacity: $ {
  props => props.invisible
    ? '0'
    : '1'};
`

const CorrectSwiper = styled(SwiperBase)`
${ ''/* determine translation amount from position */}
  transform: translateX(${props => (props.position === 'hide' && '-100%') || (props.position === 'peek' && '-97.5%') || (props.position === 'hide-opposite' && '50%')});
  background:  ${props => props.theme.colors.correct}
`

const IncorrectSwiper = styled(SwiperBase)`
  ${ ''/* determine translation amount from position */}
  transform: translateX(${props => (props.position === 'hide' && '50%') || (props.position === 'peek' && '47.5%') || (props.position === 'hide-opposite' && '-100%')});
  background:  ${props => props.theme.colors.incorrect}
`

export default Swiper;
