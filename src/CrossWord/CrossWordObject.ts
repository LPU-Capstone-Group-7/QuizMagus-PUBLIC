
import { TriviaQuestion } from "../TriviaGame/TriviaGameObject";

export class CrossWordSettings{
    triviaQuestions : TriviaQuestion[]
    randomizeQuestions : boolean;
    basedGrading : string;
    timeLimit : number;
    numOfLettersToShow : number;
    showCorrectAnswer : boolean;

    constructor (triviaQuestions : TriviaQuestion[], enableRandomize : boolean, basedGrading : string, timeLimit : number, numOfLettersToShow : number, showCorrectAnswer : boolean){
        this.triviaQuestions = triviaQuestions
        this.randomizeQuestions = enableRandomize 
        this.basedGrading = basedGrading
        this.timeLimit = timeLimit
        this.numOfLettersToShow = numOfLettersToShow
        this.showCorrectAnswer = showCorrectAnswer
    }
}

export const validateCrosswordSettings = (settings : CrossWordSettings) => {
    try { 
        for (let i = 0; i < settings.triviaQuestions.length; i++) {
            const { question, answer } = settings.triviaQuestions[i];
            if (question === '' || answer === '') {
                throw `Error: Invalid Input for item ${i+1}. Question and Answer must both have an input`;
            }
            if (!/^[a-zA-Z\s]+$/.test(answer)) {
                throw `Error: Invalid Input for item ${i+1}. Please stick to letters A to Z only.`;
            }
            if (answer.length < 3 || answer.length > 20) {
                throw `Error: Invalid Input for item ${i+1}. Answer should be between 3 to 20 characters long`;
            }
        }


          if(!settings.timeLimit || settings.timeLimit <= 0) 'Please Enter Desired Time per Question'
          if (settings.showCorrectAnswer === undefined)throw 'Please Fill out the Show Correct Answer Field' // CHECK IF SHOW ANSWER HAS AN INPUT
          if (settings.randomizeQuestions === undefined)throw 'Please Fill out the Enable Randomize Field' // CHECK IF RANDOMIZE FIELD HAS AN INPUT
          if (settings.numOfLettersToShow === undefined || settings.numOfLettersToShow <= 0)throw 'Please Fill out the maxNumberOfChoices Field' // CHECK IF MAX NUMBER HAS AN INPUT

        return {message : '', isValid : true}
    } catch (error) {
        console.log(error)
        return {message : error as string, isValid : false}
    }
}