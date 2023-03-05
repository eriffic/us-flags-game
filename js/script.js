//Select Elements
let countSpan = document.querySelector('.count span');
let flagImgDiv = document.querySelector('.flag-img');
let flagImg = document.querySelector('.flag-img img');
let flagOptions = document.querySelector('.flag-options ul');
let flagLis = document.querySelectorAll('.flag-options ul li');
let score = document.querySelector('h4 span');
let scoreDiv = document.querySelector('.score');
let correctAns = document.querySelector('.score .right span');
let incorrectAns = document.querySelector('.score .incorrect span');
let btnNewGame = document.querySelector('#newGame');

let currentIndex = 0;
let rightAnswer = 0;

function getQuestions() {
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let questions = JSON.parse(this.responseText);
            //Number Of Question Each New Game
            let qCount = 35;
            questionNum(qCount);
            //Random Question Each New Game
            questions = questions.sort(() => Math.random() - Math.random()).slice(0, 35);

            //Add Questions Data
            addQuestionData(questions[currentIndex], qCount);

            flagLis.forEach(li => {
                li.addEventListener('click', () => {
                    let rightAnswer = questions[currentIndex].right_answer;
                    li.classList.add('active');
                    //Increase Index 
                    currentIndex++;

                    //Check The Answer after 500ms
                    setTimeout(() => {
                        checkAnswer(rightAnswer, qCount);
                    }, 500);

                    setTimeout(() => {
                        //Remove Previous Image Source
                        flagImg.src = '';
                        //Remove All Classes (active,success,wrong)
                        li.classList.remove('active');
                        li.classList.remove('success');
                        li.classList.remove('wrong');

                        //Add Questions Data To Show The Next Question
                        addQuestionData(questions[currentIndex], qCount);
                    }, 1000);

                    //Show Results
                    setTimeout(() => {
                        showResults(qCount);
                    }, 1002);
                });
            });
        }
    }
    myRequest.open("GET", "js/flag_questions.json", true);
    myRequest.send();
}

getQuestions();

function questionNum(num) {
    countSpan.innerHTML = num;
}

function addQuestionData(obj, count) {
    if (currentIndex < count) {
        flagImg.src = `img/${obj.img}`;
        //Create Options
        flagLis.forEach((li, i) => {
            //Give each Li a dynamic Id
            li.id = `answer_${i+1}`;
            //Create for Each Li a dynamic data-attribut
            li.dataset.answer = obj[`options`][i];
            //Insert the Option in the li
            li.innerHTML = obj[`options`][i];
        });
    }
}

function checkAnswer(rAnswer, count) {
    let choosenAnswer;
    for (let i = 0; i < flagLis.length; i++) {
        if (flagLis[i].classList.contains('active')) {
            choosenAnswer = flagLis[i].dataset.answer;
            if (rAnswer === choosenAnswer) {
                flagLis[i].classList.add('success');
                rightAnswer++;
                score.innerHTML = rightAnswer;
            } else {
                flagLis[i].classList.add('wrong');
            }
        }
    }
}

//Function To Show result correct and wrong answer
function showResults(count) {
    if (currentIndex === count) {
        flagOptions.innerHTML = '';
        flagImgDiv.innerHTML = '';
        scoreDiv.style.display = 'block';
        correctAns.innerHTML = rightAnswer;
        incorrectAns.innerHTML = count - rightAnswer;
    }
}

//To Generate A New Game
btnNewGame.addEventListener('click', () => {
    window.location.reload();
});

// MEMORY CODE
const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
// let cards;
let interval;
let firstCard = false;
let secondCard = false;

// //Items array
// const items = [
//   { name: "bee", image: "bee.png", },
//   { name: "crocodile", image: 'image/crocodile.png' },
//   { name: "macaw", image: "macaw.png" },
//   { name: "gorilla", image: "gorilla.png" },
//   { name: "tiger", image: "tiger.png" },
//   { name: "monkey", image: "monkey.png" },
//   { name: "chameleon", image: "chameleon.png" },
//   { name: "piranha", image: "piranha.png" },
//   { name: "anaconda", image: "anaconda.png" },
//   { name: "sloth", image: 'image/sloth.png' },
//   { name: "cockatoo", image: "cockatoo.png" },
//   { name: "toucan", image: "toucan.png" },
// ];

//Initial Time
let seconds = 0,
  minutes = 0;
// //Initial moves and win count
// let movesCount = 0,
//   winCount = 0;

//For timer
const timeGenerator = () => {
  seconds += 1;
  //minutes logic
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
  //format time before displaying
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
};

// //For calculating moves
// const movesCounter = () => {
//   movesCount += 1;
//   moves.innerHTML = `<span>Moves:</span>${movesCount}`;
// };

// //Pick random objects from the items array
// const generateRandom = (size = 4) => {
//   //temporary array
//   let tempArray = [...items];
//   //initializes cardValues array
//   let cardValues = [];
//   //size should be double (4*4 matrix)/2 since pairs of objects would exist
//   size = (size * size) / 2;
//   //Random object selection
//   for (let i = 0; i < size; i++) {
//     const randomIndex = Math.floor(Math.random() * tempArray.length);
//     cardValues.push(tempArray[randomIndex]);
//     //once selected remove the object from temp array
//     tempArray.splice(randomIndex, 1);
//   }
//   return cardValues;
// };

const matrixGenerator = (cardValues, size = 4) => {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  //simple shuffle
  cardValues.sort(() => Math.random() - 0.5);
  for (let i = 0; i < size * size; i++) {
    /*
        Create Cards
        before => front side (contains question mark)
        after => back side (contains actual image);
        data-card-values is a custom attribute which stores the names of the cards to match later
      */
    gameContainer.innerHTML += `
     <div class="card-container" data-card-value="${cardValues[i].name}">
        <div class="card-before">?</div>
        <div class="card-after">
        <img src="${cardValues[i].image}" class="image"/></div>
     </div>
     `;
  }
  // //Grid
  // gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

  //Cards
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      //If selected card is not matched yet then only run (i.e already matched card when clicked would be ignored)
      if (!card.classList.contains("matched")) {
        //flip the cliked card
        card.classList.add("flipped");
        //if it is the firstcard (!firstCard since firstCard is initially false)
        if (!firstCard) {
          //so current card will become firstCard
          firstCard = card;
          //current cards value becomes firstCardValue
          firstCardValue = card.getAttribute("data-card-value");
        } else {
          //increment moves since user selected second card
          movesCounter();
          //secondCard and value
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue == secondCardValue) {
            //if both cards match add matched class so these cards would beignored next time
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            //set firstCard to false since next card would be first now
            firstCard = false;
            //winCount increment as user found a correct match
            winCount += 1;
            //check if winCount ==half of cardValues
            // if (winCount == Math.floor(cardValues.length / 2)) {
            //   result.innerHTML = `<h2>You Won</h2>
            // <h4>Moves: ${movesCount}</h4>`;
            //   stopGame();
            // }
          } else {
            //if the cards dont match
            //flip the cards back to normal
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 900);
          }
        }
      }
    });
  });
};

//Start game
startButton.addEventListener("click", () => {
  // movesCount = 0;
  seconds = 0;
  minutes = 0;
  //controls amd buttons visibility
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
  //Start timer
  interval = setInterval(timeGenerator, 1000);
  //initial moves
  moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
  initializer();
});

//Stop game
stopButton.addEventListener(
  "click",
  (stopGame = () => {
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval);
  })
);

//Initialize values and func calls
const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom();
  console.log(cardValues);
  matrixGenerator(cardValues);
};