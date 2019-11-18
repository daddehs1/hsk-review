// reducer
// consume action and make appropriate mutations to state based on action type

import {SET_REVIEW_OPTIONS, INITIALIZE_FLASHCARDS, PUSH_TO_PROGRESS_HISTORY, CLEAR_PROGRESS_HISTORY, RESET_STATE} from "./actionTypes";

// define conditions for initial state
const initialState = {
  // flag for whether the review has been properly initialized (e.g. reviewOptions have been set)
  isInitialized: true,
  reviewOptions: {
    // HSK Levels: should include vocabulary from this HSK level in flashcard review
    HSK1: false,
    HSK2: false,
    HSK3: false,
    HSK4: false,
    HSK5: false,
    HSK6: true,
    // number of cards that will be included in review
    numCards: 5,
    // flag for determining whether to re-review incorrectly answered flashcards after first round review
    reviewIncorrect: true,
    // flag for determining whether Mandarin pronunciations should be displayed to user in Zhuyin (bopomofo)
    useZhuyin: false,
    // flag for determining whether Chinese characters should be displayed to user using traditional characters
    useTraditional: false
  },
  // flashcard set, initially empty
  flashcards: {},
  // review progress, history of flashcard + whether user answered correct/incorrect, initially empty
  progressHistory: []
};

export default function(state = initialState, action) {
  switch (action.type) {
      /**
     * set current flashcardIDs to any given set. used when first initializing
     * @param {Object} action.payload.options The options that user has selected for this review session
     */
    case SET_REVIEW_OPTIONS:
      return {
        ...state,
        isInitialized: true,
        reviewOptions: {
          ...action.payload.options
        }
      }
      /**
    * set flashcards to provided set
    * @param {Object[]} action.payload.flashcards The set of flashcards
    */
    case INITIALIZE_FLASHCARDS:
      return {
        ...state,
        flashcards: action.payload.flashcards
      }
      /**
    * push historyPoint onto progressHistory
    * @param {Object} action.payload.historyPoint The options that user has selected for this review session
    */
    case PUSH_TO_PROGRESS_HISTORY:
      return {
        ...state,
        progressHistory: [
          ...state.progressHistory,
          action.payload.historyPoint
        ]
      }
      /**
      * clear progressHistory by resetting to initial value
      */
    case CLEAR_PROGRESS_HISTORY:
      {
        return {
          ...state,
          progressHistory: initialState.progressHistory
        }
      }
      /**
      * reset state to initialState
      */
    case RESET_STATE:
      return {
        ...initialState
      }
    default:
      return {
        ...state
      };
  }
}
