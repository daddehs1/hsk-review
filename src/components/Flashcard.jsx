// Flashcard component
// displays flashcard prompt (character + pronunciation
// in revealed state also displays answer (definitions)
// transitions beteween not-revealed and revealed UI states

import React, {useMemo} from 'react';
import {connect} from 'react-redux'
import classNames from 'classnames';
import styled from 'styled-components';

/**
 * Flashcard component
 * -- Passed from Parent --
 * @param  {Object} props.flashcard Information about a word to display in flashcard form
 *   @param  {string} hanzi simplified Chinese characters for the word
 *   @param  {string} hanziTraditional traditional Chinese characters for the word
 *   @param  {string} pinyin pinyin pronunciation for the word
 *   @param  {string || string[]} zhuyin zhuyin pronunciation for the words, Array if length > 1
 * -- Mapped from State --
 * @param {boolean} props.useZhuyin whether to display pronunciation as zhuyin
 * @param {boolean} props.useTraditionalCharacters whether to display characters as traditional characters
 */
function Flashcard(props) {
  const classObject = {
    "flashcard--revealed": props.revealed
  };

  // number of characters in the flashcard hanzi
  // used to scale font-size down for longer words/pronunciations
  const numChars = props.flashcard.hanzi.length;
  // pronunciation will be either pinyin or zhuyin depending on user-selected review options
  // zhuyin is a string for one-character flashcards, for multicharacter flashcards it is an Array
  var pronunciation = useMemo(() => {
    if (props.useZhuyin) {
      var flashcardZhuyin = props.flashcard.zhuyin;
      return Array.isArray(flashcardZhuyin)
        ? flashcardZhuyin.join(" ")
        : flashcardZhuyin;
    } else {
      return props.flashcard.pinyin;
    }
  }, [props.flashcard.pinyin, props.flashcard.zhuyin, props.useZhuyin])

  return (<FlashcardWrapper
    // if in revealed UI state, apply className to wrapper to be able to access in child styled components
    className={classNames(classObject)}>

    {/* Prompt group, shows the character and pronunciation
      shrinks during revealed UI state */
    }
    <Prompt>
      {/* determine which character to use (simplified vs. traditional) depending on user selected reviewOptions */}
      <Character numChars={numChars}>{
          props.useTraditionalCharacters
            ? props.flashcard.hanziTraditional
            : props.flashcard.hanzi
        }</Character>
      {/* use numChars with an additional scaling factor for zhuyin, which is less character-dense than pinyin */}
      <Pronunciation numChars={numChars * (
          props.useZhuyin
          ? 2
          : 1)}>{pronunciation}</Pronunciation>
    </Prompt>

    {/* Answer group, shows the definitions
      is displayed and expands during revealed UI state */
    }
    <Answer>
      {/* display defnitions as a list */}
      <DefinitionList>
        {/* only display top 3 definitions if there are more than 3 */}
        {props.flashcard.translations.slice(0, 3).map((translation, index) => <DefinitionListItem key={index}>{translation}</DefinitionListItem>)}
      </DefinitionList>
    </Answer>
  </FlashcardWrapper>);
}

const FlashcardWrapper = styled.div `
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`

const Prompt = styled.div `
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 2rem 1rem;
  transition: flex-grow 0s;

${ ''/* shrik during UI revealed state */}
  .flashcard--revealed & {
    flex-grow: 0;
    transition: flex-grow .2s ease-out;
  }
`

// used to scale down font-size for longer characters/
// TODO: current scaling system is not very precise, calculated by what looks good optically
// maybe make more systematic in future version
const characterScaleFactors = [
  12,
  10,
  8,
  7,
  6,
  5,
  5,
  5
];
const Character = styled.div `
  font-size: calc(${props => characterScaleFactors[props.numChars - 1]} * ${props => props.theme.baseFontSize});
  line-height: 1;
  width: 100%;
  margin: 2rem 0;
  transition: font-size 0s;
  color: white;

${ ''/* scale down font in UI revealed state */}
  .flashcard--revealed & {
    font-size: calc(.75 * ${props => characterScaleFactors[props.numChars - 1]} * ${props => props.theme.baseFontSize});
    transition: font-size 0.3s ease-out;
  }

`

const Pronunciation = styled.div `
  font-size: calc(.5 * ${props => characterScaleFactors[props.numChars - 1]} * ${props => props.theme.baseFontSize});
  line-height: 1;
  transition: font-size 0s;

${ ''/* scale down font in UI revealed state */}
  .flashcard--revealed & {
    font-size: calc(.333 * ${props => characterScaleFactors[props.numChars - 1]} * ${props => props.theme.baseFontSize});
    transition: font-size 0.3s ease-out;
  }
`

const Answer = styled.div `
  flex-shrink: 1;
  font-size: calc(2 * ${props => props.theme.baseFontSize});
  opacity: 0;
  height: 0;
  transition: opacity 0s;

${ ''/* reveal and expand in UI revealed state */}
  .flashcard--revealed & {
    flex-grow: 1;
    opacity: 1;
    transition: opacity 0.3s 0.3s ease-out;
  }
`

const DefinitionList = styled.ul `
  z-index: 100;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 5%;
  list-style: none;
  font-weight: bold;
`

const DefinitionListItem = styled.li `
  margin: 1rem;
  height: 0;

  .flashcard--revealed & {
    height: auto;
  }
`
const mapStateToProps = state => ({useZhuyin: state.reviewOptions.useZhuyin, useTraditionalCharacters: state.reviewOptions.useTraditionalCharacters})

export default connect(mapStateToProps)(Flashcard);
