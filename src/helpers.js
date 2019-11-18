// define helper functions

/**
 * shuffleArray
 * takes in an array and returns a randomly shuffled version of the same array
 * @param {Array} array the array to be shuffle
 *
 * @return {Array} the shuffled array
 */
export const shuffleArray = array => {
  var shuffled = array.splice(0);
  for (var i = shuffled.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }
  return shuffled;
}
