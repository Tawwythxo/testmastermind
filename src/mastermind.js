const colors = require('./colors')
const hints = require('./hints')
const gameProgress = require('./gameProgress')

function getRandom() {
    let zufall = Math.random();
    return zufall;
}

function pickColor(getRandom) {
    let randomNumber = getRandom();

    if (randomNumber >= 1.0) {
        let safety = randomNumber - Math.trunc(randomNumber);
        randomNumber = safety.toFixed(3);

    }

    if (randomNumber < 0.125) {
        return colors.RED
    } else if (randomNumber >= 0.125 && randomNumber < 0.25) {
        return colors.GREEN;
    } else if (randomNumber >= 0.25 && randomNumber < 0.375) {
        return colors.YELLOW;
    } else if (randomNumber >= 0.375 && randomNumber < 0.5) {
        return colors.BLUE;
    } else if (randomNumber >= 0.5 && randomNumber < 0.625) {
        return colors.PURPLE;
    } else if (randomNumber >= 0.625 && randomNumber < 0.75) {
        return colors.ORANGE;
    } else if (randomNumber >= 0.75 && randomNumber < 0.875) {
        return colors.PINK;
    } else if (randomNumber >= 0.875 && randomNumber < 1.00) {
        return colors.BROWN;
    }


}

function generateCode() {

    let farbcode = [];
    for (var i = 0; i <= 3; i++) {

        farbcode[i] = pickColor(getRandom);

        while (farbcode[i] === farbcode[i - 1] || farbcode[i] === farbcode[i - 2] || farbcode[i] === farbcode[i - 3]) {
            farbcode[i] = pickColor(getRandom);
        }

    }
    return farbcode;
}


function checkCode(code, guess) {
    const result = [];

    for (var i = 0; i <= 3; i++) {
        if (code[i] === guess[i]) {
            result.push(hints.FITS)
        } else if (code.indexOf(guess[i]) !== -1) {
            result.push(hints.PARTIALLY)
        } else {
            result.push(hints.WRONG)
        }
    }
    return result


}

function scrumble(code, guess) {
    var result = [];

    for (var i = 0; i <= 3; i++) {
        if (code[i] === guess[i]) {
            result.push(hints.FITS)
        } else if (code.indexOf(guess[i]) !== -1) {
            result.push(hints.PARTIALLY)
        } else {
            result.push(hints.WRONG)
        }

    }

    for (var i = result.length - 1; i > 0; i--) {
        var random = Math.floor(Math.random() * (i + 1));
        [result[i], result[random]] = [result[random], result[i]]
    }
    return result
}



//secret Code
let secretCode = generateCode();
console.log("SECRET CODE: " + generateCode())


function inputPlayer(colorInput) {

    //Spielereingabe
    var input = String(colorInput);

    //Farbguesses Splitten in Chars
    var colorguess = input.split('');

    //Gesplittete Chars umwandeln in Farben
    var colorguessConverted = []

    //Farbenauswertung und in colorguessCoverted-Array hinzufügen
    for (var i = 0; i < colorguess.length; i++) {
        if (colorguess[i] === "R") {
            colorguessConverted[i] = colors.RED;
        } else if (colorguess[i] === "G") {
            colorguessConverted[i] = colors.GREEN;
        } else if (colorguess[i] === "Y") {
            colorguessConverted[i] = colors.YELLOW;
        } else if (colorguess[i] === "B") {
            colorguessConverted[i] = colors.BLUE;
        } else if (colorguess[i] === "L") {
            colorguessConverted[i] = colors.PURPLE;
        } else if (colorguess[i] === "O") {
            colorguessConverted[i] = colors.ORANGE;
        } else if (colorguess[i] === "P") {
            colorguessConverted[i] = colors.PINK;
        } else if (colorguess[i] === "S") {
            colorguessConverted[i] = colors.BROWN;
        }
    }

    return colorguessConverted;
}


function runden(tries) {
    //Runden
    tries = 0;
    return tries;
}

function gamePlay(guessPlayer) {

    var tries = runden();

    //Rundenergebnisse
    var guessesOfRounds = [];

    //PlayerGuess
    guessPlayer = inputPlayer()


    //CheckCode and getting hints
    guessesOfRounds[tries] = checkCode(secretCode, guessPlayer);

    //   console.log(guessesOfRounds[tries])

    tries++;
    return guessesOfRounds

}


function mastermindGameResult(tries, roundResults) {

    //Maximale Rundenanzahl
    let maximalTries = 11;

    //Momentare Runde
    tries = runden();

    //Alle Guesses richtig
    var allFIT = [hints.FITS, hints.FITS, hints.FITS, hints.FITS]


    //Ergebnis der letzten Runde annehmen
    roundResults = []

    for (var i = 0; i <= 11; i++) {
        // roundResults[i] = [hints.FITS, hints.FITS, hints.FITS, hints.PARTIALLY];
        roundResults[i] = gamePlay();
    }

    //roundResults[2] = [hints.FITS, hints.FITS, hints.FITS, hints.FITS];



    //Bedingung Sieg
    for (var i = 0; i <= 11; i++) {
        if ((arraysAreIdentical(allFIT, roundResults[i]) === true) && tries <= maximalTries) {
            console.log("WON")
            return gameProgress.WON
        }

    } if (tries <= maximalTries) {
        console.log("PENDING")
        return gameProgress.PENDING
    } else if (tries > maximalTries) {
        console.log("LOST")
        return gameProgress.LOST
    }

}


function arraysAreIdentical(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (var i = 0, len = arr1.length; i < len; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}

module.exports = {
    getRandom,
    pickColor,
    generateCode,
    checkCode,
    scrumble,
    runden,
    inputPlayer,
    gamePlay,
    mastermindGameResult,
    arraysAreIdentical
}