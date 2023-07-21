import { changeToTitleCase } from "./utils"

export const errorColor : string = "#FF0000"
export const successColor : string = "#9acd32"
export const yellowColor : string = "#FFE15D"

export const passingGrade : number = 75

export const OPEN_AI_KEY = YOUR API KEY HERE

export const promptContext : string = 
`You are a question bank generator for a jeopardy game that generates very short close-ended questions whose answers are technically worded answers that are not in a form of phrase or sentences. Reply "NO" if I asked for more than 20 items.
Generate a number of questions depending on the topic mentioned earlier and reply based on the format that I would mention. You are to reply only in this format without any numbering, "question sentence//short answer==question sentence//short answer==". Do not give questions that require to give examples,list down termsm, or could have other possible answers.
`

// ** ============================================== **
// **    FIREBASE COLLECTION NAMES                   **
// ** ============================================== **

export const customizedGameResultCol = "customizedGameResult"

// ** ============================================== **
// **    CUSTOMIZED GAME TUTORIAL WINDOW             **
// ** ============================================== **

export interface CarouselStep {
    carouselStep : string, 
    header : string, 
    image : string, 
    body : string
}

export const wordSearchTutorial: CarouselStep[] = [
    {
      carouselStep: "carousel_one",
      header: "Word Search Game",
      image: "word_carousel_image",
      body: "Welcome to the captivating world of word search puzzles! Sharpen your observation skills and embark on a thrilling journey of finding hidden words in a grid. Scan the puzzle horizontally, vertically, and diagonally to locate the words cleverly hidden within the jumble of letters.",
    },
    {
      carouselStep: "carousel_two",
      header: "Find the words",
      image: "word_carousel_image2",
      body: "Locate the hidden words in the grid.",
    },
    {
      carouselStep: "carousel_three",
      header: "Answer choices",
      image: "word_carousel_image3",
      body: "The word choices will be displayed on the right side below the question. When you find a correct word, it will be crossed out from the choices. As you guess correctly, the remaining answer choices will decrease, helping you solve more efficiently.",
    },
    {
      carouselStep: "carousel_four",
      header: "Helping Hint",
      image: "word_carousel_image4",
      body: "Need some help? Click the hint button to highlight the words for a split second, making them easier to spot.",
    },
    {
      carouselStep: "carousel_five",
      header: "Score Summary",
      image: "word_carousel_image5",
      body: "Once you finish, a summary of your score will be displayed.",
    },
];

export const triviaGameTutorial: CarouselStep[] = [
    {
      carouselStep: "carousel_one",
      header: "Trivia Game",
      image: "trivia_carousel_image",
      body: "Welcome to the exciting world of trivia! Test your knowledge and challenge your friends in this engaging game of questions and guessing. Answer a wide range of interesting and thought-provoking questions from various categories.",
    },
    {
      carouselStep: "carousel_two",
      header: "Guess the answers",
      image: "trivia_carousel_image2",
      body: "Answer each question by typing in your guess.",
    },
    {
      carouselStep: "carousel_three",
      header: "Time and hints",
      image: "trivia_carousel_image3",
      body: "As time runs out, a hint will be provided.",
    },
    {
      carouselStep: "carousel_four",
      header: "Mini-games",
      image: "trivia_carousel_image4",
      body: "Look out for popping question marks! Click on them to play mini-games for hints or power-ups.",
    },
    {
      carouselStep: "carousel_five",
      header: "Score summary",
      image: "trivia_carousel_image5",
      body: "Once you finish, a summary of your score will be displayed.",
    },
];

export const crossWordTutorial: CarouselStep[] = [
  {
    carouselStep: "carousel_one",
    header: "Crossword Game",
    image: "crossword_carousel_image",
    body: "Welcome to our crossword game! Solve the puzzle by filling in the grid with the correct words. ",
  },
  {
    carouselStep: "carousel_two",
    header: "Game Interface",
    image: "crossword_carousel_image2",
    body: "The game features a crossword grid in the center. Click the arrow on the left or a grid cell to reveal the question at the bottom.",
  },
  {
    carouselStep: "carousel_three",
    header: "Answering Questions",
    image: "crossword_carousel_image3",
    body: "Read the question carefully, type your answer in the input area.",
  },
  {
    carouselStep: "carousel_four",
    header: "Scoring and Progress",
    image: "crossword_carousel_image4",
    body: "Earn points for correct answers, with your score displayed at the top. Fill in the grid cells with correct letters as you progress through the game.",
  },
  {
    carouselStep: "carousel_five",
    header: "Score Summary",
    image: "crossword_carousel_image5",
    body: "When you're done playing, click End in the upper right corner. You can then review a summary of your score.",
  },
];


// ** ============================================== **
// **    CLASS LIST CONSTANTS DATA                   **
// ** ============================================== **

export interface Student{
  id: string,
  name : string,
  email : string,
}

// ** ============================================== **
// **    SMTP EMAIL TEMPLATE                         **
// ** ============================================== **

export const emailOTPTemplate =  (name : string, otp : string) => `
<body>
  <div style="text-align: center;">
    <h1>🎉 Quiz Magus OTP Time!</h1>
    <p>Hey ${changeToTitleCase(name)},</p>
    <p>Your Magical One-Time Password (OTP) has arrived:</p>
    <h2 style="background-color: #f5f5f5; padding: 10px; display: inline-block;">${otp}</h2>
    <p>Woohoo! This OTP holds the key to unlocking incredible adventures.</p>
    <p>Embrace the power of this mystical code and let it guide you to the next level!</p>
    <br>
    <p>Remember, the fun and magic last for a limited time.</p>
    <p>So, quick! Use this OTP to embark on your extraordinary journey.</p>
    <br>
    <p>Wishing you success in your upcoming challenges!</p>
  </div>
</body>
`