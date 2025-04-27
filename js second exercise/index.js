function squareNumber(x){
    z = x * x;
    console.log(`Squaer of ${x} is ${z}`);
    return z;
};
// squareNumber(2);

function halfNumber(x){
    z = x / 2.0;
    console.log(`Half of ${x} is ${z}`);
    return z;
}
// halfNumber(2);

function percentOf(x, y){
    z = x / y * 100
    console.log(`${x} is ${z} percent of ${y}`);
    return z;
}
// percentOf(5, 10);

function areaOfCircle(r){
    z = 3.14 * r * r;
    console.log(`Area of circle with radius ${r} is ${z}`);
    return z;
}
// areaOfCircle(4);

function allInOne(x){
    a = halfNumber(x);
    b = squareNumber(a);
    c = areaOfCircle(b);
    d = percentOf(c, b);
    return d;
}

allInOne(4);

function mixUp(x, y){
    console.log(y.slice(0, 2) + x.slice(2) + " " + x.slice(0, 2) + y.slice(2));
}
mixUp("Hello", "World");

function fixStart(x){
    const a = x[0];
    const b = new RegExp(a, 'g');
    const c = a + x.slice(1).replace(b, '*');
    console.log(`Modified string: "${c}"`);
}
fixStart("babble");

function verbing(x){
    n = x.length;
    if(n < 3){
        console.log(x);
        return;
    }else if(x.slice(n-3) === "ing"){
        x += "ly";
        console.log(x);
        return;
    }else{
        x += "ing";
        console.log(x);
        return;
    }
};
verbing("swimming");

function notBad(x){
    const a = x.indexOf("not");
    const b = x.indexOf("bad");
    if(!(a === -1 || b === -1) && a < b){
        console.log(x.slice(0, a) + "good" + x.slice(b+3));
    }
    console.log(`Not : ${a} \nBad : ${b}`);
}
notBad("This food is not that bad bro");

function pluralzize(x, n) {
    let z = x;
    if (n !== 1) {
      if (x === 'sheep' || x === 'geese') {
        z = x;
      } else {
        z = x + 's';
      }
    }
    console.log(`${n} ${z}`);
}
pluralzize("kutta", 3);

const choices = ["blue", "green", "red", "purple", "yellow"];

function suffix(i) {
  const j = i % 10,
        k = i % 100;
  if (j == 1 && k != 11) {
    return "st";
  }
  if (j == 2 && k != 12) {
    return "nd";
  }
  if (j == 3 && k != 13) {
    return "rd";
  }
  return "th";
}

choices.forEach((choice, index) => {
  console.log(`My ${index + 1}${suffix(index + 1)} choice is ${choice}.`);
});

const word = ['H', 'E', 'L', 'L', 'O'];
let guessed = ['_', '_', '_', '_', '_'];
let guessedLetters = [];
let reward = 0;
let hangmanState = 0;

function guessLetter(letter) {
  let found = false;
  if (guessedLetters.includes(letter)) {
    console.log(`You already guessed "${letter}".`);
    return;
  }

  guessedLetters.push(letter);

  for (let i = 0; i < word.length; i++) {
    if (word[i] === letter) {
      guessed[i] = letter;
      found = true;
    }
  }

  console.log(guessed.join(''));

  if (found) {
    let prize = Math.floor(Math.random() * 100) + 1;
    reward += prize;
    console.log(`Good guess! You earned $${prize}. Current balance: $${reward}`);
  } else {
    reward -= 10;
    hangmanState++;
    console.log(`Wrong guess. Lost $10. Current balance: $${reward}`);
  }

  if (!guessed.includes('_')) {
    console.log(`Congratulations! You won! Current balance: $${reward}`);
  }

  if (hangmanState >= 6) {
    console.log("You lost! Hangman complete!");
  }
}

guessLetter('H');
guessLetter('A');
guessLetter('E');
guessLetter('X');
guessLetter('L');
guessLetter('Z');
guessLetter('L');
guessLetter('O');

const recipe = {
    title: "PBJ",
    servings: 2,
    ingredients: ["peanut butter", "jelly", "bread"]
};

console.log("Recipie TITLE: ",recipe.title);
console.log(`Serves: ${recipe.servings}`);
console.log("Ingredients:");
recipe.ingredients.forEach(ingredient => console.log(ingredient));


const books = [
    { title: "Mein Kampf", author: "Adolf Hitler", alreadyRead: true },
    { title: "The Rise and Fall of Adolf Hitler", author: "William L. Shirer", alreadyRead: false }
];
  
books.forEach(book => {
    if (book.alreadyRead) {
      console.log(`You already read "${book.title}" by ${book.author}.`);
    } else {
      console.log(`You still need to read "${book.title}" by ${book.author}.`);
    }
});

const favoriteMovie = {
    title: "The GodFather",
    duration: 175,
    stars: ["Marlon Brando", "Al Pacino", "James Caan"]
};
  
function printMovie(movie) {
    console.log(`${movie.title} lasts for ${movie.duration} minutes. Stars: ${movie.stars.join(', ')}.`);
}
printMovie(favoriteMovie);


function cashRegister(cart) {
    let total = 0;
    for (let item in cart) {
        total += parseFloat(cart[item]);
    }
    return total;
}
  
const cartForParty = {
    banana: "1.25",
    handkerchief: ".99",
    Tshirt: "25.01",
    apple: "0.60",
    nalgene: "10.34",
    proteinShake: "22.36"
};
console.log(cashRegister(cartForParty));


function validateCreditCard(cardNumber) {
    const cleaned = cardNumber.replace(/-/g, '');
    if (cleaned.length !== 16) {
        return { valid: false, number: cardNumber, error: 'wrong_length' };
    }
    if (!/^\d+$/.test(cleaned)) {
        return { valid: false, number: cardNumber, error: 'invalid_characters' };
    }
    if (new Set(cleaned).size === 1) {
        return { valid: false, number: cardNumber, error: 'only_one_type_of_number' };
    }
    if (parseInt(cleaned[cleaned.length - 1]) % 2 !== 0) {
        return { valid: false, number: cardNumber, error: 'odd_final_number' };
    }
    const sum = cleaned.split('').reduce((acc, curr) => acc + parseInt(curr), 0);
    if (sum <= 16) {
        return { valid: false, number: cardNumber, error: 'sum_less_than_16' };
    }
    return { valid: true, number: cardNumber };
}
console.log(validateCreditCard('1234-5678-1234-5678'));
console.log(validateCreditCard('a923-3211-9c01-1112'));
