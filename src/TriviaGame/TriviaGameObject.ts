export class TriviaQuestion{
  question : string;
  answer : string;
  difficulty : string;
  id : string;

  constructor(question : string, answer : string, difficulty : string, id : string){
    this.question = question
    this.answer = answer
    this.difficulty = difficulty
    this.id = id
  }
}

export class TriviaGameSettings{ //TRIVIA GAME SETTINGS CLASS FOR UNITY GAME

  triviaQuestions : TriviaQuestion[];
  timePerQuestions : number;
  enableHints : boolean;
  randomizeQuestions : boolean;
  basedGrading : string;

  constructor(triviaQuestions : TriviaQuestion[], timePerQuestions : number, enableHints : boolean, randomizeQuestions : boolean, basedGrading : string){

    this.triviaQuestions = triviaQuestions;
    this.timePerQuestions = timePerQuestions;
    this.enableHints = enableHints;
    this.randomizeQuestions = randomizeQuestions;
    this.basedGrading = basedGrading
  }
}
export class TriviaGameResults{
playerName : string;
triviaDatas : TriviaData[]
totalGrade : number
playingTime : number
numberOfAttempts : number

constructor(playerName : string, triviaDatas : TriviaData[], totalGrade : number, playingTime : number, numberOfAttempts : number){
  this.playerName = playerName
  this.triviaDatas = triviaDatas
  this.totalGrade = totalGrade
  this.playingTime = playingTime
  this.numberOfAttempts = numberOfAttempts
}
}

export class TriviaData{
triviaQuestionNummber : number
timeToAnswer : number
correct : boolean

constructor(triviaQuestionNumber : number, timeToAnswer : number, correct : boolean){
  this.triviaQuestionNummber = triviaQuestionNumber
  this.timeToAnswer = timeToAnswer
  this.correct = correct;
}
}

export const getTriviaResultScore = (triviaDatas : TriviaData[]) => {
let correctAnswers : number = 0

for (let i = 0; i < triviaDatas.length; i++) {
  if(triviaDatas[i].correct) correctAnswers++
}

return correctAnswers
}

export const getPlayingTime = (triviaDatas  : TriviaData[]) => {
let totalSeconds : number = 0

for (let i = 0; i < triviaDatas.length; i++) {
  totalSeconds += triviaDatas[i].timeToAnswer
}

return totalSeconds;
}

export const validateTriviaGameSettings =(triviaQuestions : TriviaQuestion[], time : number, enableHints : boolean, enableRandomize : boolean) => {

  try{
    for (let i = 0; i < triviaQuestions.length; i++) {
      if(triviaQuestions[i].question == '' || triviaQuestions[i].answer == '') throw 'Question and Answer must both have an input'
    }

    if(!time) throw 'Please Enter Desired Time per Question'
    if (enableHints === undefined)throw 'Please Fill out the Enable Hints Field' // CHECK IF HINTS FIELD HAS AN INPUT
    if (enableRandomize === undefined)throw 'Please Fill out the Enable Randomize Field' // CHECK IF RANDOMIZE FIELD HAS AN INPUT

    return {message : '', isValid : true}
  }
  catch(error){
    console.log(error)
    return {message : error as string, isValid : false}
  }
}

export const convertToTriviaQuestions = (items : {question : string, answer : string, difficulty : string, id : string}[]) => {
  const triviaQuestions : TriviaQuestion[] = [];
  items.forEach(item => {
    triviaQuestions.push(new TriviaQuestion(item.question, item.answer, item.difficulty, item.id))
  });

  return triviaQuestions
}
