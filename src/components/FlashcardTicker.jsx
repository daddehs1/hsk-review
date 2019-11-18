// FlashcardTicker component
// displays flashcard information to user in grid format, one flashcard at time
// can be scrolled through horizontally through user
// also autoscrolls at a given interval when user is not pressing down on the card

import React, {useEffect, useRef, useCallback} from 'react';
import styled from 'styled-components';
import smoothscroll from 'smoothscroll-polyfill';

// pollyfill to enable smooth scrolling behavior for Safari
smoothscroll.polyfill();

/**
 * FlashcardTicker component
 * @param {Object[]} props.content flashcard content to be displayed in this ticker
 *   props.content[x]:
 *   @param {string} character character of the word
 *   @param {string} pronunciation pronunciation of the word
 *   @param {string} definition definition of word
 *   @param {boolean} isCorrect whether the user answered this word correct
 */
function FlashcardTicker(props) {
  // reference to the wrapper element for the content
  const contentWrapperRef = useRef(null);

  // reference to hold boolean for whether auto scrolling of ticker should be enabled or locked
  const scrollLock = useRef(false);

  // function to enable scrollLock
  const enableScrollLock = () => {
    scrollLock.current = true;
  }

  // function to disable scrollLock
  // memoize so window addEventListener useEffect hook isn't triggered on each rerender
  const disableScrollLock = useCallback(() => {
    scrollLock.current = false;
  }, []);

  // attach an event listener to the window to allow user to disable scrollLock by lifting pointer outside of current element
  useEffect(() => {
    window.addEventListener("pointerup", (disableScrollLock));
    // clean up
    return() => {
      window.removeEventListener("pointerup", disableScrollLock);
    }
  }, [disableScrollLock])

  // enable autoscroll for ticker to scroll through content automatically at given interval
  const SCROLL_INTERVAL = 2500;
  useEffect(() => {
    // setInterval for autoscroll
    const scrollInterval = setInterval(() => {
      // if scrollLock is enabled, do not scroll
      if (!scrollLock.current) {
        // scroll amount equivalent to one scrollWidth of content wrapper divided by number of elements in content
        const width = contentWrapperRef.current.scrollWidth;
        const scrollInterval = width / props.content.length;
        const scrollSoFar = contentWrapperRef.current.scrollLeft;
        // calculate amount that will be scrolled after next scroll
        const nextScroll = scrollSoFar + scrollInterval;
        // if next scroll is past the scrollWidth of content, instead scroll back to 0
        // tolerance added for rounding errors
        const scrollLeft = nextScroll >= width - (scrollInterval / 3)
          ? 0
          : nextScroll;
        contentWrapperRef.current.scrollTo({behavior: 'smooth', left: scrollLeft});
      }
    }, SCROLL_INTERVAL);
    // clean up
    return() => {
      clearInterval(scrollInterval);
    }
  }, [props.content.length])

  return (<TickerWrapper
    // if user trigger pointerDown on this element, enable scrollLock
    onPointerDown={enableScrollLock} ref={contentWrapperRef}>
    {
      // map content elements (flashcards) onto a grid of content
      props.content.map((flashcard, index) => {
        const numChars = flashcard.character.length;
        return <Content key={index}>
          {/* grid representing layout for display of this flashcard */}
          <ContentGrid>
            {/* use numChars to allow scaling down of font-size for longer words */}
            <Character numChars={numChars} isCorrect={flashcard.isCorrect}>{flashcard.character}</Character>
            <Pronunciation numChars={numChars}>{flashcard.pronunciation}</Pronunciation>
            <Definition numChars={flashcard.definition.length}>
              {flashcard.definition}
            </Definition>
          </ContentGrid>
        </Content>
      })
    }
  </TickerWrapper>)
}

const TickerWrapper = styled.div `
  display: flex;
  flex-wrap: nowrap;
  background-color: rgba(255,255,255,.2);
  border-radius: 1rem;
  margin: 1rem;
${ ''/* style to enable horizontal scrolling and snapping */}
  white-space: nowrap;
  word-break: nowrap;
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
  &::-webkit-scrollbar {
    display:none;
  }
}
`

const Content = styled.div `
  scroll-snap-align: start;
  padding: 1rem;
  display:inline-grid;
  min-width: 100%;
`

const ContentGrid = styled.div `
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  flex-shrink: 0;
  align-items: center;
`

// used to scale down font-size for longer characters/
// TODO: current scaling system is not very precise, calculated by what looks good optically
// maybe make more systematic in future version
const characterScaleFactors = [
  4.5,
  4.5,
  4,
  3.5,
  1.75,
  1.5,
  1.5,
  1.5
];

const Character = styled.span `
  font-weight: 500;
  text-align: right;
  font-size: calc(${props => characterScaleFactors[props.numChars - 1]} * ${props => props.theme.baseFontSize});
  grid-area: character;
  color: ${props => props.isCorrect
  ? props.theme.colors.correct
  : props.theme.colors.incorrect};
  margin: 0 .5rem;
`
const Pronunciation = styled.span `
  text-align: left;
  ${ ''/* font-size: calc(1.8 * ${props => props.theme.baseFontSize}); */}
  font-size: calc(.4 * ${props => characterScaleFactors[props.numChars - 1]} * ${props => props.theme.baseFontSize});
  margin: 0 .5rem;
`

const Definition = styled.div `
  font-size: calc((2 - ${props => props.numChars / 100}) * ${props => props.theme.baseFontSize});
  white-space: normal;
  grid-area: definitions;
`
export default FlashcardTicker;
