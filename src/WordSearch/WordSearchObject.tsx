
import { TriviaQuestion } from "../TriviaGame/TriviaGameObject";

export class WordSearchSettings{
    triviaQuestions : TriviaQuestion[]
    allowBackwards : boolean;
    allowDiagonals : boolean;
    enableHints : boolean;
    randomizeQuestion : boolean;
    maxNumOfChoices : number;
    basedGrading : string;
    timeLimit : number;


    constructor (triviaQuestions : TriviaQuestion[], allowBackwards : boolean, allowDiagonals : boolean, enableHints : boolean, enableRandomize : boolean, maxNumOfChoices : number, basedGrading : string, timeLimit : number){
        this.triviaQuestions = triviaQuestions
        this.allowBackwards = allowBackwards
        this.allowDiagonals = allowDiagonals
        this.enableHints = enableHints
        this.randomizeQuestion = enableRandomize 
        this.maxNumOfChoices = maxNumOfChoices
        this.basedGrading = basedGrading
        this.timeLimit = timeLimit
    }
}

export const validateWordSearchSettings = (settings : WordSearchSettings) => {
    try { 
        for (let i = 0; i < settings.triviaQuestions.length; i++) {
            const { question, answer } = settings.triviaQuestions[i];
            if (question === '' || answer === '') {
                throw `Error: Invalid Input for item ${i+1}.Question and Answer must both have an input`;
            }
            if (!/^[a-zA-Z\s]+$/.test(answer)) {
                throw `Error: Invalid Input for item ${i+1}. Please stick to letters A to Z only.`;
            }
            if (answer.length < 3 || answer.length > 20) {
                throw `Error: Invalid Input for item ${i+1}. Answer should be between 3 to 20 characters long`;
            }
        }


          if(!settings.timeLimit || settings.timeLimit <= 0) 'Please Enter Desired Time per Question'
          if( settings.enableHints == undefined ) throw 'Please Fill out the Enable Hints Field' // CHECK IF HINTS FIELD HAS AN INPUT
          if (settings.randomizeQuestion === undefined)throw 'Please Fill out the Enable Randomize Field' // CHECK IF RANDOMIZE FIELD HAS AN INPUT
          if (settings.allowBackwards === undefined)throw 'Please Fill out the Allow Backwards Field' // CHECK IF ALLOW BACKWARDS FIELD HAS AN INPUT
          if (settings.allowDiagonals === undefined)throw 'Please Fill out the Allow Diagonals Field' // CHECK IF ALLOW DIAGONALS HAS AN INPUT
          if (settings.maxNumOfChoices === undefined || settings.maxNumOfChoices <= 0)throw 'Please Fill out the maxNumberOfChoices Field' // CHECK IF MAX NUMBER HAS AN INPUT

        return {message : '', isValid : true}
    } catch (error) {
        console.log(error)
        return {message : error as string, isValid : false}
    }
}
