var letter;
var currentWord=[];
var guessedLetters=[];
var allGuessedLetters=[];
var containsLetter=false;
var solution;
var gamesLost=0;
var gamesWon=0;
const maxMisses = 10;
var words = ['guitar', 'tornado', 'pickles', 'hideous', 'banana'];


/**
 * Selects a random word from the words array. Pops that word out of
 * the array so it won't be reused.
 */
function getRandomWord() {
  var randIndex = Math.floor(Math.random()*words.length);
  document.getElementById("random-word").innerHTML = words[randIndex];
  return words[randIndex];
}

/**
 * Gets a new word and creates an array containing '_ ' for each letter
 */
function getNewWord() {
  solution = getRandomWord();
  currentWord = Array(solution.length).fill('_ '); 
  document.getElementById("current-word").innerHTML = currentWord.join('');
}

/**
 * Checks if letter is in the solution word. If so, the displayed
 * word is updated with the new letter and the function returns true.
 * Otherwise the function returns false.
 * @param {*} letter 
 */
function updateWord(letter) {
  var containsLetter = true;

  if (solution.indexOf(letter) < 0) {
    containsLetter=false;
    return;
  } else {
    for (var i=0; i < solution.length; i++)
    {
      if (letter === solution[i]){
        currentWord[i] = letter.toUpperCase();
      }
    }
  }
  return containsLetter;
}

/**
 * End game if max number of misses is reached or if word has been solved.
 */
function endGame() {
  if ((guessedLetters.length >= maxMisses) || (currentWord.indexOf('_ ') === -1) ) {
    return true;
  } else {
    return false;
  }
}

/**
 * Checks if game was won or lost and increments the corresponding
 * counter (gamesWon or gamesLost).
 * Displays and game over message.
 * Clears the guessedLetters array. 
 */
function resetGame() {
  var msg="";
  if (guessedLetters.length === maxMisses) {
    msg = "Sorry you lost. The word was: " + solution;
    gamesLost++;
    document.getElementById("games-lost").innerHTML=gamesLost;
    document.getElementById("game-over").innerHTML=msg;
  } else {
    msg = "Congratulations!";
    gamesWon++;
    document.getElementById("games-won").innerHTML=gamesWon;
    document.getElementById("game-over").innerHTML=msg;
  }
  guessedLetters = [];
  allGuessedLetters = [];
}

function validKey(k) {
  const validLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return validLetters.indexOf(k.toUpperCase()) === -1 ? false: true;
}

document.onkeyup = function(event) {
  letter = event.key;
  console.log(validKey(letter));
  if (!allGuessedLetters.includes(letter.toUpperCase()) && validKey(letter)) {
    allGuessedLetters.push(letter.toUpperCase());
    goodGuess = updateWord(letter);
    if (!goodGuess) {
      guessedLetters.push(letter.toUpperCase());
      document.getElementById("guessed-letters").innerHTML=guessedLetters.join(' ');
    } else {
      document.getElementById("current-word").innerHTML = currentWord.join('');
  
    }
    if (endGame()) {
      resetGame();
      getNewWord();
    }
  };
};