// Review Page
// second page that user sees
// contains the flashcard review / test

import React, {useReducer, useCallback, useEffect, useRef} from 'react';
import {connect} from 'react-redux'
import {initializeFlashcards, pushToProgressHistory, clearProgressHistory} from "../redux/actions";
import {withRouter} from 'react-router-dom'
import styled from 'styled-components';
import {shuffleArray} from '../helpers'
import Swiper from '../components/Swiper'
import Progress from '../components/Progress'
import Scorebar from '../components/Scorebar'
import Flashcard from '../components/Flashcard'
import IconButton from '../components/IconButton'
import {Tab, TabContainer} from '../components/Tab'
import Modal from '../components/Modal';

// object containing the initial component state
const initialState = {
  // the current round number of the review
  // used to distinguish between initial review and re-review of incorrect cards
  currentRound: 1,
  // number of flashcards attempted so far
  // equivalent to the index of the current flashcard
  numAttempted: 0,
  // counters for number of cards scored scored correctly and incorrectly
  numCorrect: 0,
  numIncorrect: 0,
  // array of flashcardIDs representing the active set for the current round
  activeFlashcardIDs: [],

  /* UI STATE */
  // flag for whether UI is currently in revealed mode (showing the answer to a flashcard prompt)
  isRevealed: false,
  // flag for whether buttons and other UI elements are disabled
  // set during transition/animation between flashcards
  isUILocked: false,
  // flag for whether swipers should be invisible, used to revert swipers to their original position after animation
  isSwipersInvisible: false,
  // current position of each swiper
  // hide: hidden off-screen on it's own side
  // peek: swiper is partially shown on it's own side (desktop only, used when hovering over answer buttons)
  // hide-opposite: swiper is hidden off screen on the opposite side
  correctSwiperPosition: 'hide',
  incorrectSwiperPosition: 'hide',
  // name of currently opened modal, null if none are opened
  currentOpenModalName: null
};

// object containing information about modals present on this page
const modals = {
  // modal displayed after user completes test if reviewIncorrect option is selected and user has some cards incorrect
  reviewIncorrect: {
    title: 'Review Incorrect Words',
    body: 'You have finished reviewing your selected flashcards for the test. Any words you missed will now be repeated until there are none left!',
    leaveBackground: false
  },
  // modal displayed when test is completely finished including any incorrect cards re-review
  testComplete: {
    title: 'Test Complete!',
    body: 'You have completed the test! Advance to the next page to see some stats on your test.',
    leaveBackground: true
  }
}

const answerButtons = [
  {
    type: 'incorrect',
    icon: 'x',
    label: 'Incorrect',
    setSwiperPositionActionType: 'setIncorrectSwiperPosition'
  }, {
    type: 'correct',
    icon: 'check',
    label: 'Correct',
    setSwiperPositionActionType: 'setCorrectSwiperPosition'
  }
]

/**
 * reducer used to manage mutations to component state
 * @param {Object} state The form state passed in from component
 * @param {Object} action The action for the reducer to act upon
 *   @param {string} action.type The type of action to take
 *   @param {Object} [action.payload] Any parameters that must be passed along for the action
 */
function reducer(state, action) {
  switch (action.type) {
      /**
       * advance current round and reset counters
       * @param {Number[]} action.payload.activeFlashcardIDs The array of new flashcardIDs to be used in this round
       */
    case 'advanceRound':
      return {
        ...state,
        currentRound: state.currentRound + 1,
        numCorrect: 0,
        numIncorrect: 0,
        numAttempted: 0,
        activeFlashcardIDs: action.payload.activeFlashcardIDs
      };
      /**
       * set current flashcardIDs to any given set. used when first initializing
       * @param {Number[]} action.payload.activeFlashcardIDs The array of new flashcardIDs to be used in this round
       */
    case 'setActiveFlashcardsIDs':
      return {
        ...state,
        activeFlashcardIDs: action.payload.activeFlashcardIDs
      }
      /**
       * increments appropriate counters to advance to next flashcard
       * @param {boolean} action.payload.isCorrect Whether the previous flashcard was answered correctly
       */
    case 'advanceCurrentFlashcard':
      const answerNumType = action.payload.isCorrect
        ? 'numCorrect'
        : 'numIncorrect'
      return {
        ...state,
        numAttempted: state.numAttempted + 1,
        [answerNumType]: state[answerNumType] + 1
      };
      /**
       * Set/Clear isUILocked flag
       */
    case 'setUILocked':
      return {
        ...state,
        isUILocked: true
      }
    case 'clearUILocked':
      return {
        ...state,
        isUILocked: false
      }
      /**
       * Set swiper position
       */
    case 'setCorrectSwiperPosition':
      return {
        ...state,
        correctSwiperPosition: action.payload.position
      }
    case 'setIncorrectSwiperPosition':
      return {
        ...state,
        incorrectSwiperPosition: action.payload.position
      }
      /**
       * Set/Clear isSwipersInvisible flag
       */
    case 'setSwipersInvisible':
      return {
        ...state,
        isSwipersInvisible: true
      }
    case 'clearSwipersInvisible':
      return {
        ...state,
        isSwipersInvisible: false
      }
      /**
       * Set/Clear isRevealed flag
       */
    case 'setRevealed':
      return {
        ...state,
        isRevealed: true
      }
    case 'clearRevealed':
      return {
        ...state,
        isRevealed: false
      }
      /**
       * Opens a particular modal
       * @param {string} action.payload.modalName The name of the modal to open
       */
    case 'openModal':
      return {
        ...state,
        currentOpenModalName: action.payload.modalName
      }
      /**
       * Closes the currently opened modal
       */
    case 'closeModal':
      return {
        ...state,
        currentOpenModalName: null
      }
    default:
      throw new Error();
  };
}

/**
 * Overview component
 * -- Mapped from State --
 * @param {boolean} props.isInitialized whether application has been properly initialized (i.e. user has selected options)
 *
 * @param {Object} props.reviewOptions user-selected options about the review
 *   @param {boolean} useZhuyin whether to display pronunciation as zhuyin
 *   @param {boolean} useTraditionalCharacters whether to display characters as traditional characters
 *   @param {boolean} numCards the number of flashcards to use in this review
 *   @param {boolean} HSK1 whether to pull cards from the HSK Level 1 set for this review
 *   note: above is repeated for HSK2 - HSK 6
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
 * -- Mapped from Dispatch --
 * @param  {Function} props.initializeFlashcards initialize flashcard set based on review options and random selection
 * @param  {Function} props.pushToProgressHistory push a history point onto progress history
 * @param  {Function} props.clearProgressHistory reset progress history
 */

function Review(props) {
  // redirect user to the select page if hasn't been initialized (i.e. review options have been properly selected)
  if (!props.isInitialized) {
    props.history.replace('./')
  }

  // maintain an array of timeouts to be cleared on clean up
  // timeouts used within animation cascade
  const animationTimeouts = useRef([]);
  // function to clean up all timeouts with animationTimeouts array
  const clearAllTimeouts = () => {
    animationTimeouts.current.forEach(timeout => clearTimeout(timeout));
    animationTimeouts.current = [];
  }

  // clean up any timeouts
  useEffect(() => {
    return() => {
      clearAllTimeouts();
    }
  }, [])

  // destructure actions from props to avoid using props as dependency
  const {reviewOptions, initializeFlashcards, clearProgressHistory} = props;

  // clear any potential lingering progressHistory left over from previous reviews
  useEffect(() => {
    clearProgressHistory();
  }, [clearProgressHistory])

  // on first load, initialize flashcards based on the selected review options
  useEffect(() => {
    const HSKLevels = {
      HSK1: reviewOptions.HSK1,
      HSK2: reviewOptions.HSK2,
      HSK3: reviewOptions.HSK3,
      HSK4: reviewOptions.HSK4,
      HSK5: reviewOptions.HSK5,
      HSK6: reviewOptions.HSK6
    }
    initializeFlashcards(HSKLevels, reviewOptions.numCards);
  }, [
    initializeFlashcards,
    reviewOptions.HSK1,
    reviewOptions.HSK2,
    reviewOptions.HSK3,
    reviewOptions.HSK4,
    reviewOptions.HSK5,
    reviewOptions.HSK6,
    reviewOptions.numCards
  ]);

  // initialize state with the reducer function and initial state
  const [state, dispatch] = useReducer(reducer, {
    ...initialState
  });

  // set initial first-round activeFlashcardIDs (all flashcards) once flashcards have been initialized and mapped to props
  useEffect(() => {
    dispatch({
      type: 'setActiveFlashcardsIDs',
      payload: {
        activeFlashcardIDs: Object.keys(props.flashcards)
      }
    })
  }, [props.flashcards]);

  /**
   * event handler for correct/incorrect button onclick
   * manages timing of swiper animation and state change for smooth UX
   * changes to UI that correspond to flashcard being advanced are timed so that transitions occur while swipers are covering the screen
   * --ANIMATION TIMELINE--
   * 0ms- Initialize Animation: lock UI and trigger swiper animation
   * 300ms - Advance State: at this time, swiper is covering screen, advance state to make UI transitions "behind the scenes"
   * 600ms - Reset Sipwers: at this time, swiper animation is complete, set swipers to invisible, and change position back to hide to trigger return transition
   * 700ms - Finalize Animation: at this time, animation and state transition is fully complete, unlock UI, finish resetting swipers
   * ----------------------
   * @param {Object} payload The payload sent by the button onclick function
   *   @param {string} payload.type The type of button and corresponding answer type ("correct" or "incorrect")
   */
  // wrap function in useCallback to memoize
  const handleButtonOnClick = useCallback(payload => {
    // INITIALIZE ANIMATION
    // lock UI so buttons can not be pressed until animation is finished and state has been updated
    dispatch({type: 'setUILocked'});
    // set some initial variables based on whether user answer was correct or incorrect
    var swiperActionType,
      isCorrect;
    if (payload.type === 'correct') {
      swiperActionType = 'setCorrectSwiperPosition';
      isCorrect = true;
    } else {
      swiperActionType = 'setIncorrectSwiperPosition'
      isCorrect = false;
    }
    // set appropriate swiper position to hide-opposite to trigger swiping animation
    dispatch({
      type: swiperActionType,
      payload: {
        position: 'hide-opposite'
      }
    });

    // ADVANCE STATE
    const advanceStateTimeout = setTimeout(() => {
      // clear UI isRevealed flag
      dispatch({type: 'clearRevealed'});
      // push the answer choice and corresponding flashcard info into progressHistory (redux state)
      props.pushToProgressHistory({
        isCorrect,
        flashcardID: state.activeFlashcardIDs[state.numAttempted],
        round: state.currentRound
      })
      // advance current flashcard to next
      dispatch({type: 'advanceCurrentFlashcard', payload: {
          isCorrect
        }})
    }, 300)

    // RESET SWIPERS
    const resetSwipersTimeout = setTimeout(() => {
      // set swipers invisible for return animation
      dispatch({type: 'setSwipersInvisible'});
      // set swiper position to hide, triggering return animation
      dispatch({
        type: swiperActionType,
        payload: {
          position: 'hide'
        }
      });
    }, 600)

    const finalizeAnimationTimeout = setTimeout(() => {
      // clear UI lock and reset swipers
      dispatch({type: 'clearUILocked'});
      dispatch({type: 'clearSwipersInvisible'});

      // clear and empty the timeouts
      clearAllTimeouts();
    }, 700)

    // add all newly set timeouts to animationTimeouts array
    animationTimeouts.current = [advanceStateTimeout, resetSwipersTimeout, finalizeAnimationTimeout];
  }, [props, state.activeFlashcardIDs, state.currentRound, state.numAttempted]);

  // get current flashcard from currentFlashcardID
  // use dummy flashcard to avoid rendering issues while initializing
  const currentFlashcardID = state.activeFlashcardIDs[state.numAttempted];
  const currentFlashcard = props.flashcards[currentFlashcardID] || {
    hanzi: "",
    hanziTraditional: "",
    pinyin: "",
    zhuyin: "",
    translations: []
  };

  // logic to determine whether review is finished
  // checks both if current round is finished, and if test is completely finished
  // also handles opening modals as necessary
  useEffect(() => {
    // boolean for determing whether review should be over
    var isReviewOver = false;
    // boolean for determining if flashcards have been initialized
    // used to avoid immediately declaring that review is over in initial state
    // initial state: number of cards reviewed = 0, number of flashcards total = 0
    const hasInitializedFlashcards = Object.keys(props.flashcards).length && state.activeFlashcardIDs.length;
    // boolean for if all flashcards of the current round have been reviewed
    const isAllCurrentFlashcardsReviewed = state.numAttempted === state.activeFlashcardIDs.length
    // combination of both previous booleans indicate that review has been initiailzed and is over
    if (hasInitializedFlashcards && isAllCurrentFlashcardsReviewed) {
      // if user as indicated they wish to re-review incorrect flashcards after the first round is over
      // open reviewIncorrect modal
      if (props.reviewOptions.reviewIncorrect) {
        if (state.currentRound === 1) {
          dispatch({
            type: 'openModal',
            payload: {
              modalName: 'reviewIncorrect'
            }
          });
        }

        // Gather flashcardIDs for next round from progressHistory
        var newActiveFlashcardIDs = props.progressHistory
        // first filter progressHistory to only include incorrectly answered flashcards from the current round
          .filter(historyPoint => {
          const cardShouldRepeat = historyPoint.round === state.currentRound && !historyPoint.isCorrect;
          return cardShouldRepeat;
        })
        // then map progressHistory into an array of flashcardIDs
          .map(historyPoint => historyPoint.flashcardID);
        // shuffle new array to randomize order that the flashcards will repeat in
        newActiveFlashcardIDs = shuffleArray(newActiveFlashcardIDs);
        // if new array is empty (i.e. if there were no cards in current round incorrect)
        // then review is over
        if (newActiveFlashcardIDs.length === 0) {
          isReviewOver = // else advnace to the next round with the newly created activeFlashcardIDs array
          true;
        } else {
          dispatch({
            type: 'advanceRound',
            payload: {
              activeFlashcardIDs: newActiveFlashcardIDs
            }
          }) // if user has not selected reviewIncorrect option, review is over without advancing round
        }
      } else {
        isReviewOver = true;
      }
      // if the review is over, open testComplete modal
      if (isReviewOver) {
        dispatch({
          type: 'openModal',
          payload: {
            modalName: 'testComplete'
          }
        });
      }
    }
  }, [
    props.flashcards,
    props.history,
    props.progressHistory,
    props.reviewOptions.reviewIncorrect,
    state.activeFlashcardIDs.length,
    state.currentRound,
    state.numAttempted,
    state.progressHistory
  ])

  // define exit-functions of modals
  var currentOpenModal,
    modalExitFunction;
  // reviewIncorrect Modal, closes modal on exit
  if (state.currentOpenModalName === 'reviewIncorrect') {
    currentOpenModal = modals.reviewIncorrect;
    modalExitFunction = () => {
      dispatch({type: 'closeModal'});
    }
  } else if (state.currentOpenModalName === 'testComplete') {
    currentOpenModal = modals.testComplete;
    // reviewIncorrect Modal, closes advances to overview on exit
    modalExitFunction = () => {
      // const results = getResultsFromProgressHistory();
      // props.setResults(results)
      props.history.replace('./overview');
    }
  }

  /**
   * factory to create IconButton in the form of an answer button (Correct / Incorrect buttons)
   * memoized using isUILocked as dependency
   * @param {Object} buttonInfo Information about this button to be passed on in props
   *
   * @return {IconButton} IconButton component corresponding to a particular answer button
   */
  const createAnswerButton = useCallback(buttonInfo => <IconButton key={buttonInfo.type} type={buttonInfo.type} small="small" icon={buttonInfo.icon} label={buttonInfo.label}
    // have corresponding swiper peek out on mouseover
    onMouseOver={() => state.isUILocked || dispatch({
      type: buttonInfo.setSwiperPositionActionType,
      payload: {
        position: 'peek'
      }
    })}
    // have corresponding swiper hide on mouseout
    onMouseOut={() => state.isUILocked || dispatch({
      type: buttonInfo.setSwiperPositionActionType,
      payload: {
        position: 'hide'
      }
    })}
    // call handler for button onclick
    onClick={() => {
      state.isUILocked || handleButtonOnClick({type: buttonInfo.type})
    }}></IconButton>, [handleButtonOnClick, state.isUILocked])

  return (<React.Fragment>
    {/* Modal, conditionally rendered if some modal is open (i.e. currentOpanModal !== null) */}
    {currentOpenModal && <Modal leaveBackground={currentOpenModal.leaveBackground} title={currentOpenModal.title} body={currentOpenModal.body} onExit={modalExitFunction}/>}

    {/* Correct/Incorrect Swipers */}
    <Swiper invisible={state.isSwipersInvisible} type='correct' position={state.correctSwiperPosition}/>
    <Swiper invisible={state.isSwipersInvisible} type='incorrect' position={state.incorrectSwiperPosition}/>

    <ProgressContainer>
      {/* Progress bar containing percentage of incorrect/answers */}
      <Progress history={props.progressHistory.filter(historyPoint => historyPoint.round === state.currentRound)} numTotal={state.activeFlashcardIDs.length}/>
    </ProgressContainer>

    {/* Scorebar - shows basic info about number attempted and number correct */}
    <Scorebar numAttempted={state.numAttempted} numTotal={state.activeFlashcardIDs.length} numCorrect={state.numCorrect}></Scorebar>

    <FlashcardContainer>
      {/* Flashcard - component which contains the prompt and answer information of the current flashcard */}
      <Flashcard flashcard={currentFlashcard} revealed={state.isRevealed}></Flashcard>
    </FlashcardContainer>

    {/* Container which holds the reveal button as well as the answer correct/incorrect buttons */}
    <ButtonContainer>
      {/* Tab container to switch between reveal and correct/incorrect button set depending on UI state */}
      <TabContainer target={state.isRevealed
          ? "answer-choices"
          : "reveal"} instant={!state.isRevealed}>
        {/* Tab which contains Reveal Button */}
        <Tab name="reveal" instant="default">
          <IconButton icon="eye" label="Reveal" onClick={() => dispatch({type: 'setRevealed'})}></IconButton>
        </Tab>

        {/* Tab which contains Correct/Incorrect Answer Buttons */}
        <Tab name="answer-choices">
          <GraderContainer>
            {
              answerButtons.map(buttonInfo => {
                return createAnswerButton(buttonInfo)
              })
            }
          </GraderContainer>
        </Tab>
      </TabContainer>
    </ButtonContainer>
  </React.Fragment>)
}

const ProgressContainer = styled.div `
  margin: 1rem;
  width: 80%
`

const FlashcardContainer = styled.div `
  flex: 1;
`
const ButtonContainer = styled.div `
  margin-top: 3rem;
  width: 100%;
`

const GraderContainer = styled.div `
  display: flex;
  justify-content: space-around;
`
const mapStateToProps = state => {
  return ({
    reviewOptions: {
      ...state.reviewOptions
    },
    isInitialized: state.isInitialized,
    flashcards: state.flashcards,
    progressHistory: state.progressHistory
  })
}

export default withRouter(connect(mapStateToProps, {initializeFlashcards, pushToProgressHistory, clearProgressHistory})(Review));
