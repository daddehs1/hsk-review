// Overview Page
// third screen the user sees
// displays results of the review / test including some tests

import React, {useMemo} from 'react';
import {useMediaQuery} from 'react-responsive'
import styled, {withTheme} from 'styled-components';
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'

import {Bar} from 'react-chartjs-2';
import IconButton from '../components/IconButton'
import FlashcardTicker from '../components/FlashcardTicker.jsx'

/**
 * Overview component
 * -- Mapped from State --
 * @param {boolean} props.isInitialized whether application has been properly initialized (i.e. user has selected options)
 *
 * @param {Object} props.reviewOptions user-selected options about the review
 *   @param {boolean} useZhuyin whether to display pronunciation as zhuyin
 *   @param {boolean} useTraditionalCharacters whether to display characters as traditional characters
 *
 * @param {Object[]} props.progressHistory the history of the review with information about the flashcard and the user interaction
 *   props.progressHistory[x]:
 *   @param {string} flashcardID the flashcardID of the word represented by this history point
 *   @param {Number} round the review round number that this history point occured in
 *   @param {boolean} isCorrect whether this history point represents the user answering correctly
 *
 * @param {Object[]} props.flashcards the flashcard bank, an array of all flashcards that were used during the review
 *   props.flashcards[x]:
 *   @param  {string} hanzi simplified Chinese characters for the word
 *   @param  {string} hanziTraditional traditional Chinese characters for the word
 *   @param  {string} pinyin pinyin pronunciation for the word
 *   @param  {string || string[]} zhuyin zhuyin pronunciation for the words, Array if length > 1
 *   @param  {Number} HSKLevel zhuyin pronunciation for the words, Array if length > 1
 */
function Overview(props) {
  // redirect user to the select page if hasn't been initialized (i.e. review options have been properly selected)
  if (!props.isInitialized) {
    props.history.replace('./')
  }

  // useMediaQuery hook used for determining if orientation is portrait mode
  // used to style certain elements such as the chartJS Bar Chart
  const isPortrait = useMediaQuery({orientation: 'portrait'})

  // extract and memoize only round one history from progressHistory
  const roundOneHistory = useMemo(() => props.progressHistory.filter(historyPoint => historyPoint.round === 1), [props.progressHistory])

  // map and memoize progressHistory into a flashcard history
  // contains a combination of history data (i.e. isCorrect) and flashcard data (e.g. character)
  // used as prop in FlashcardTicker component
  const roundOneFlashcardHistory = useMemo(() => {
    return roundOneHistory.map(historyPoint => {
      // extract flashcard from this particular history point's flashcardID
      const flashcard = props.flashcards[historyPoint.flashcardID];
      // determine which character to use (simplified vs. traditional) depending on user selected reviewOptions
      const character = props.reviewOptions.useTraditionalCharacters
        ? flashcard.hanziTraditional
        : flashcard.hanzi;
      // determine which pronunciation to use (pinyin vs. zhuyin) depending on user selected reviewOptions
      const pronunciation = props.reviewOptions.useZhuyin
        ? flashcard.zhuyin.join(" ")
        : flashcard.pinyin
      // map all necessary data
      return {character, pronunciation, definition: flashcard.translations[0], HSKLevel: flashcard.HSKLevel, isCorrect: historyPoint.isCorrect}
    })
  }, [props.flashcards, props.reviewOptions.useTraditionalCharacters, props.reviewOptions.useZhuyin, roundOneHistory])

  // extract and memoize correct cards from roundOneHistory
  // used for stats in the Bar Chart
  const correctCards = useMemo(() => roundOneHistory.filter(card => card.isCorrect), [roundOneHistory]);
  // calculate and memoize percentage of flashcards answered correctly to display as data to user
  const percentCorrect = useMemo(() => Math.round(correctCards.length / roundOneHistory.length * 100), [roundOneHistory.length, correctCards.length]);

  // calculate and memoize number correct/incorrect/total for each individual HSK Level of flashcards
  // used to generate data for the Bar Chart showing percentages correct by level
  // TODO don't really need both correct and incorrect if we have total, can just extrapolate incorrect% = 1-correct%
  const [correctNums, incorrectNums, totalNums] = useMemo(() => {
    // start with Arrays of six 0s (one for each HSK Level)
    var correctNums = Array(6).fill(0);
    var incorrectNums = Array(6).fill(0);
    var totalNums = Array(6).fill(0);

    roundOneHistory.forEach(historyPoint => {
      // extract flashcard HSK Level from this particular history point's flashcardID
      const HSKLevel = props.flashcards[historyPoint.flashcardID].HSKLevel;
      // increment total for this HSK Level no matter what
      totalNums[HSKLevel - 1]++;
      // increment correct/incorrect appropriately based on historyPoint
      if (historyPoint.isCorrect) {
        correctNums[HSKLevel - 1]++;
      } else {
        incorrectNums[HSKLevel - 1]++;
      }
    });
    return [correctNums, incorrectNums, totalNums];
  }, [props.flashcards, roundOneHistory]);

  // generate Bar Chart data
  var correctData = [];
  var incorrectData = [];
  // iterate through each HSK Level in totalNums
  totalNums.forEach((totalNum, index) => {
    // push correct and incorrect data for this HSK Level, each as a percentage of total
    if (totalNum) {
      correctData.push(correctNums[index] / totalNum);
      incorrectData.push(incorrectNums[index] / totalNum);
    }
  })

  // extract only the HSK Levels where there is at least one card (totalNum > 0) and memoize
  const totalNumsFiltered = useMemo(() => totalNums.filter(totalNum => totalNum), [totalNums]);

  // data for the Bar Chart
  const barData = {
    datasets: [
      {
        backgroundColor: props.theme.colors.correct,
        label: 'Correct',
        data: correctData,
        stack: 1
      }, {
        backgroundColor: props.theme.colors.incorrect,
        label: 'Incorrect',
        data: incorrectData,
        stack: 1
      }
    ],
    // extract only the HSK Levels that have at least one card and memoize
    labels: useMemo(() => [
      'HSK 1',
      'HSK 2',
      'HSK 3',
      'HSK 4',
      'HSK 5',
      'HSK 6'
    ].filter((level, index) => totalNums[index]), [totalNums])
  }

  // define yAxisOptions outside of barOptions since it will be repeated
  // is repeated to have one axis each on both the left and right sides
  const yAxisOptions = {
    gridLines: {
      display: false
    },
    ticks: {
      fontColor: 'white',
      fontStyle: 'bold',
      // convert from decimal to percent for display
      callback: label => label * 100 + "%",
      min: 0,
      max: 1,
      stepSize: .5
    }
  };

  // options for Bat Chart
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    ratio: 4,
    tooltips: {
      callbacks: {
        // convert from decimal in the data to percentage
        label: (tooltipItem, data) => {
          const labelName = data.datasets[tooltipItem.datasetIndex].label;
          if (labelName === "Correct") 
            return "Correct: " + correctData[tooltipItem.index] * totalNumsFiltered[tooltipItem.index];
          else 
            return "Incorrect: " + incorrectData[tooltipItem.index] * totalNumsFiltered[tooltipItem.index];
          }
        }
    },
    scales: {
      xAxes: [
        {
          fontColor: 'white',
          gridLines: {
            display: false
          },
          ticks: {
            fontColor: 'white',
            fontStyle: 'bold'
          }
        }
      ],
      // have one yAxis on left and right side each for symmetry
      yAxes: [
        {
          ...yAxisOptions,
          position: 'left'
        }, {
          ...yAxisOptions,
          position: 'right'
        }
      ]
    },
    legend: {
      display: false
    }
  }

  return (<React.Fragment>
    <InfoGraphic>
      {/* group fpr basic information */}
      <ChartGroup>
        {/* percentage correct displayed to user */}
        <ChartTitle>{`Your Results - ${percentCorrect}% Correct!`}</ChartTitle>
      </ChartGroup>

      {/* group for flashcard ticker */}
      <ChartGroup>
        <ChartTitle>{`Flashcard Review`}</ChartTitle>
        <FlashcardTickerContainer wide={isPortrait}>
          <FlashcardTicker content={roundOneFlashcardHistory}/>
        </FlashcardTickerContainer>
      </ChartGroup>

      {/* group for Bar Chart */}
      <HSKGroup>
        <ChartTitle>HSK Breakdown</ChartTitle>
        <ChartContainer wide={isPortrait}>
          <Bar data={barData} options={barOptions}/>
        </ChartContainer>
      </HSKGroup>
    </InfoGraphic>

    <ButtonContainer>
      {/* Button to start new review session */}
      <IconButton onClick={() => {
          props.history.replace('./')
        }} icon="restart" label="New Session"/>
    </ButtonContainer>
  </React.Fragment>)
}

const InfoGraphic = styled.div `
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 2.5rem;
`
const ChartTitle = styled.div `
  font-size: calc(1.8 * ${props => props.theme.baseFontSize});
  margin-bottom: .5rem;
`
const ChartGroup = styled.div `
  width: 100%;
  padding-bottom: 1.5rem;
  &:not(:last-of-type) {
    border-bottom: 1px dashed white;
    margin-bottom: 1.5rem;
  }
  font-weight: 600;
`

const HSKGroup = styled(ChartGroup)`
  .mq-tiny & {
    display: none;
  }
`

const FlashcardTickerContainer = styled.div `
width: ${props => props.wide
  ? "100%"
  : "50%"}
margin: 0 auto;
`

const ChartContainer = styled.div `
width: ${props => props.wide
  ? "100%"
  : "50%"}
margin: 0 auto;
`

const ButtonContainer = styled.div `
width: 100%;
`

const mapStateToProps = state => {
  console.log(state.progressHistory)
  return {isInitialized: state.isInitialized, reviewOptions: state.reviewOptions, progressHistory: state.progressHistory, flashcards: state.flashcards}
}

export default withTheme(withRouter(connect(mapStateToProps)(Overview)));
