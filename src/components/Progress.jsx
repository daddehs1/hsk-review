// Progress component
// a progress bar which displays percent correct / incorrect from progressHistory

import React from 'react';
import styled from 'styled-components';

/**
 * Progress component
 * @param {Object} props.history review history to display progress of
 *   @param {boolean} isCorrect whether the user answered this word correct
 */
function Progress(props) {
  const numTotal = props.history.length;

  // TODO: useMemo here?
  // this would appear to be a case where the optimization would cost more than it saves?
  // look into some benchmarks for this
  const numCorrect = props.history.filter(progressPoint => progressPoint.isCorrect).length;
  const numIncorrect = numTotal - numCorrect;
  return (<ProgressWrapper>
    {/* Create one ProgressBar of each version for Correct and Incorrect */}
    <CorrectProgressBar widthPercent={numCorrect / numTotal * 100}/>
    <IncorrectProgressBar widthPercent={numIncorrect / numTotal * 100}/>
  </ProgressWrapper>)
}

const ProgressWrapper = styled.div `
  height: 1.4rem;
  width: 80%;
  margin: 0 auto;
  .mq-mobile & {
    width: 100%;
  }
  ${ ''/* border: 2px solid white; */}
  border-radius: 1rem;
  position: relative;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  background-color: rgba(255,255,255, .4);
`

// Base styled component for CorrectProgressBar and IncorrectProgressBar
const ProgressBar = styled.div `
  height: 100%;
  width: ${props => props.widthPercent}%;
`

const CorrectProgressBar = styled(ProgressBar)`
  background-color: ${props => props.theme.colors.correct};
`

const IncorrectProgressBar = styled(ProgressBar)`
  background-color: ${props => props.theme.colors.incorrect};
`

export default Progress;
