var letter;
var currentWord=[]; // array of current word as letters are guessed
var wrongGuessedLetters=[];  //
var allGuessedLetters=[];
var containsLetter=false;
var solution;
var gamesLost=0;
var gamesWon=0;
const maxMisses = 6;
var words = ['guitar and me', 'tornado and', 'hey pickles', 'hideous', 'banana'];
// NOTE: The relative paths here are with respect to the location
//       of the index.html file because that is where the <img> is 
//       located.
var hangmanImages = [
  'assets/images/hangman.jpg',
  'assets/images/hangman1.jpg',
  'assets/images/hangman2.jpg',
  'assets/images/hangman3.jpg',
  'assets/images/hangman4.jpg',
  'assets/images/hangman5.jpg',
  'assets/images/hangman6.jpg',
]

/**
 * Returns a random word from the words array. Pops that word out of
 * the array so it won't be reused.
 */
function getRandomWord() {
  var randIndex = Math.floor(Math.random()*words.length);
  var word = words[randIndex];
  words.splice(randIndex,1);
  return word;
}

/**
 * Gets a new word and creates an array containing '_ ' for each letter
 */
function getNewWord() {
  solution = getRandomWord();
  var solutionWords = solution.split(" ");
  // This mapping allows for multiple words in the hangman puzzle.
  currentWord = solutionWords.map((w) => {
    var tempArr = Array(w.length).fill('_ ');
    tempArr.push('&nbsp&nbsp');
    return tempArr;
  }).flat();
  document.getElementById("current-word").innerHTML = currentWord.join('');
  var hangImage = document.getElementById('hangman');
  hangImage.src = hangmanImages[0];
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
    containsLetter=false; // word does not contain the letter entered
    return;
  } else {  // word contains the letter entered
    for (var i=0; i < solution.length; i++)
    {
      if (letter === solution[i]){
        currentWord[i] = letter.toUpperCase(); // replace dash with current letter
      }
    }
  }
  return containsLetter;
}

/**
 * Resets screen back to starting point.
 */
function refreshScreen() {
  wrongGuessedLetters = [];
  allGuessedLetters = [];
  document.getElementById("guessed-letters").innerHTML=wrongGuessedLetters.join(' ');
}

/**
 * End game if max number of misses is reached or if word has been solved.
 */
function endGame() {
  if ((wrongGuessedLetters.length >= maxMisses) || (currentWord.indexOf('_ ') === -1) ) {
    return true;
  } else {
    return false;
  }
}

/**
 * Checks if game was won or lost and increments the corresponding
 * counter (gamesWon or gamesLost).
 * Displays and game over message.
 * Clears the wrongGuessedLetters array. 
 */
function resetGame(prevword) {
  var msg="";
  
  if (wrongGuessedLetters.length === maxMisses) {
    msg = "You Lost!";
    gamesLost++;
    document.getElementById("show-solution").innerHTML=`<h2>The word was ${prevword}</h2>`;
    document.getElementById("games-lost-message").innerHTML=gamesLost;
    document.getElementById("endgame-message").innerHTML=msg;
    var endImage = document.getElementById('hangman-modal');
    endImage.src = "assets/images/hangman6.jpg";
  } else {
    msg = "Congratulations!";
    gamesWon++;
    document.getElementById("show-solution").innerHTML=null;
    var endImage = document.getElementById('hangman-modal');
    endImage.src = "assets/images/happy.jpg";
    // document.getElementById("hangman-modal").innerHTML=null;
    document.getElementById("games-won-message").innerHTML=gamesWon;
    document.getElementById("endgame-message").innerHTML=msg;
  }
}

/**
 * Returns true if a valid key (a-z) has been passed in.
 * @param {*} k -- single letter
 */
function validKey(k) {
  const validLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return validLetters.indexOf(k.toUpperCase()) === -1 ? false: true;
}

document.onkeyup = function(event) {
  letter = event.key;
  // Execute the following 'if' statement if the letter is valid and if it
  // has not already been guessed.
  if (!allGuessedLetters.includes(letter.toUpperCase()) && validKey(letter)) {
    allGuessedLetters.push(letter.toUpperCase());
    goodGuess = updateWord(letter);
    if (!goodGuess) {
      wrongGuessedLetters.push(letter.toUpperCase());
      document.getElementById("guessed-letters").innerHTML=wrongGuessedLetters.join(' ');
      var hangImage = document.getElementById('hangman');
      hangImage.src = hangmanImages[wrongGuessedLetters.length];
    } else {
      document.getElementById("current-word").innerHTML = currentWord.join('');
    }

    // Note to self: Something asynchronous was going on here, so I had to save the solution
    // word in a variable and then npass it to the resetGame function instead of
    // just using the value that was stored in 'solution'. Solution was being updated
    // prior to the end of game display and when the player lost, it was showing
    // the wrong thing for the word that was missed.  (It actually displayed the
    // NEXT word that the player was supposed to guess.)
    const finalword = solution;
    if (endGame()) {
      $(document).ready(function(){
        resetGame(finalword);
        $("#game-over").modal();
        refreshScreen();
      })

    getNewWord();

    }
  };
};

