// action creators which produce actions that will be mapped through dispatch

import {SET_REVIEW_OPTIONS, INITIALIZE_FLASHCARDS, PUSH_TO_PROGRESS_HISTORY, CLEAR_PROGRESS_HISTORY, RESET_STATE} from './actionTypes';
// import set of ALL cards
import HSKByID from '../flashcards/HSKByID';
// import IDs of all cards available by level
import HSK from '../flashcards';
import {shuffleArray} from '../helpers'

export const setReviewOptions = options => {
  return ({type: SET_REVIEW_OPTIONS, payload: {
      options
    }});
}

/**
 * actionCreator for INITIALIZE_FLASHCARDS
 * uses review options to generate an appropriate random set of flashcards
 * @param {boolean[]} HSKLevels whether each HSK Level should be included when pulling cards from set
 * @param {Number} numCards number of cards to pull from set
 */
export const initializeFlashcards = (HSKLevels, numCards) => {
  // define empty array of flashcardIDs, will be populated with ids to use in initial flashcards
  var flashcardIDs = [];
  // iterate through each HSKLevel
  HSK.forEach((flashcardSet, index) => {
    const level = (index + 1);
    // if cards from this level should be included
    if (HSKLevels['HSK' + level]) {
      // concatenate set of IDs
      flashcardIDs = flashcardIDs.concat(flashcardSet);
    }
  })
  // randomize the entire array
  // slice the number array to appropriate length determined by numCards
  flashcardIDs = shuffleArray(flashcardIDs).slice(0, numCards);
  var flashcards = {};
  // iterate through flashcardIDs that will be used in this set
  flashcardIDs.forEach(id => {
    // add this flashcard from card bank to flashcard set
    flashcards[id] = HSKByID[id]
  });
  return {
    type: INITIALIZE_FLASHCARDS,
    payload: {
      flashcards: flashcards
    }
  }
}

export const pushToProgressHistory = historyPoint => {
  return {type: PUSH_TO_PROGRESS_HISTORY, payload: {
      historyPoint
    }};
}

export const clearProgressHistory = () => {
  return {type: CLEAR_PROGRESS_HISTORY}
}

export const resetState = () => {
  return {type: RESET_STATE}
}
