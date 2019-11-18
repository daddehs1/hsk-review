// Modal component
// a full-screen modal-esque component for displaying information to the user

import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import IconButton from './IconButton'
import Div100vh from 'react-div-100vh'

// duration of animation for exiting the modal
const EXIT_ANIMATION_DURATION = 600;

/**
 * FlashcardTicker component
 * @param {string} props.title title of the modal
 * @param {string} props.body message body of the modal
 * @param {boolean} props.leaveBackground whether modal should leave background opaque when fading during exit
 */
function Modal(props) {
  const [fade, setFade] = useState("");

  // function for exiting modal
  const exitModal = () => {
    setFade("fade");
  }

  // if fade has been set, set timeout to exit
  useEffect(() => {
    const exitTimeout = null;
    if (fade === "fade") {
      setTimeout(props.onExit, EXIT_ANIMATION_DURATION);
    }
    return() => {
      clearTimeout(exitTimeout)
    }
  }, [fade, props.onExit])

  // if leaveBackground is true, don't fade
  return (<ModalWrapper fade={!props.leaveBackground
      ? fade
      : undefined}>
    <Display fade={fade}>
      <Title>
        {props.title}
      </Title>
      <Body>
        {props.body}
      </Body>
      <Button>
        <IconButton onClick={exitModal} icon="x" label="Close"></IconButton>
      </Button>
    </Display>
  </ModalWrapper>)
}

const ModalWrapper = styled(Div100vh)`
  cursor: pointer;
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  height: '100rvh';
  width: 100vw;
  background-color: hsl(210, 83%, 16%);

    ${ ''/* background-image: linear-gradient(to bottom, hsl(180.26, 100%, 45.1%) 0%, hsl(180.55, 100%, 45.1%) 8.1%, hsl(181.36, 100%, 45.1%) 15.5%, hsl(182.63, 100%, 45.1%) 22.5%, hsl(184.32, 100%, 45.1%) 29%, hsl(186.36, 100%, 45.1%) 35.3%, hsl(188.72, 100%, 45.1%) 41.2%, hsl(191.34, 100%, 45.1%) 47.1%, hsl(194.16, 100%, 45.1%) 52.9%, hsl(197.11, 100%, 45.1%) 58.8%, hsl(200.1, 100%, 45.1%) 64.7%, hsl(203.01, 100%, 45.1%) 71%, hsl(205.68, 100%, 45.1%) 77.5%, hsl(207.91, 100%, 45.1%) 84.5%, hsl(209.44, 100%, 45.1%) 91.9%, hsl(210, 100%, 45.1%) 100%); */}

  ${ ''/* if fade is set, transition opacity */}
  transition: opacity ${EXIT_ANIMATION_DURATION}ms;
  opacity: ${props => props.fade
  ? 0
  : 1}
`;

const Display = styled.div `
  cursor: auto;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(255, 255, 255, .2);
  border-radius: 2rem;
  padding: calc(1 * ${props => props.theme.baseFontSize});

  ${ ''/* responsive sizing */}
  min-width: 30%;
  max-width: 50%;
  .mq-mobile & {
    max-width: 90%;
  }
  display: flex;
  flex-direction: column;
  align-items: center;

  ${ ''/* if fade is set, transition opacity */}
  transition: opacity ${EXIT_ANIMATION_DURATION}ms;
  opacity: ${props => props.fade
  ? 0
  : 1}
`;

const Title = styled.div `
  font-size: calc(2.4 * ${props => props.theme.baseFontSize});
  font-weight: 600;
  margin: 1rem;
`;

const Body = styled.div `
  width: 80%;
  font-size: calc(1.5 * calc(1.2rem + 0.35vw));
  margin: 1rem;
`;

const Button = styled.div `
  margin: 2.5rem 1rem 1rem;
  width: 100%;
`;

export default Modal;
