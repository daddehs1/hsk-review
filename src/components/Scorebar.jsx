// Scorebar component
// a simple component for displaying some numeric information about current review

import React from 'react';
import styled from 'styled-components';

/**
 * Scorebar component
 * @param {Object[]} props.numAttempted how many flashcards have been reviewed so far
 * @param {string} props.numTotal the total number of flashcards in this review session
 */
function Scorebar(props) {
  return (<ScorebarWrapper>
    {/* Display the current flashcard out of total */}
    <CompletedScore>{props.numAttempted + 1}/{props.numTotal}</CompletedScore>
    {/* Display number of flashcards correct so far */}
    <CorrectScore>{props.numCorrect}{" "}
      Correct</CorrectScore>
  </ScorebarWrapper>)
}

const ScorebarWrapper = styled.div `
  width: 100%;
  text-align: left;
  font-size: 250%;
  font-weight: 500;
  line-height: 1;
  display: flex;
  justify-content: space-around;
`

const CompletedScore = styled.div `

`

const CorrectScore = styled.div `
`

export default Scorebar;
