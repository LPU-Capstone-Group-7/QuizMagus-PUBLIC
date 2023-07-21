import { TriviaQuestion } from "./TriviaGame/TriviaGameObject";
import { passingGrade } from "./constants";

// ** ============================================== **
// **    GENERAL DATA VISUALIZATION UTILITIES        **
// ** ============================================== **

export const getStudentTotalGrades = (studentResults : any[]) => {
    const studentTotalGrades : number[] = []

    studentResults.forEach(result => {
        result.totalGrade && !isNaN(result.totalGrade) && studentTotalGrades.push(result.totalGrade)
    });

    return studentTotalGrades
}

export const getStudentResultsOutcome = (studentResults : any[]) => {
    let passingStudentCount : number = 0
    let failingStudentCount : number = 0

    for (let i = 0; i < studentResults.length; i++) {
        studentResults[i].totalGrade >= passingGrade ? passingStudentCount++ : failingStudentCount++;
    }

    return {passers : passingStudentCount, failures : failingStudentCount}
}

// ** ============================================== **
// **    TRIVIA GAME DATA VISUALIZATION UTILITIES    **
// ** ============================================== **
export const getTriviaQuestionResultsData = (studentResults : any[], triviaQuestions : any[]) => {
  
    const data : {questionNumber: string, triviaQuestion : TriviaQuestion, averageTimeToAnswer: number, correctAnswers : number, incorrectAnswers: number}[] = [] 

    //CHECKS IF THE STUDENT RESULTS CONTAIN THESE QUESTIONS AND COLLECT THE NUMBER OF CORRECT AND INCORRECT RESPONSES
    for (let i = 0; i < triviaQuestions.length; i++) {

        let dataIndex = {questionNumber : `Q${i+1}`, triviaQuestion : triviaQuestions[i], averageTimeToAnswer: 0, correctAnswers : 0, incorrectAnswers : 0}
        const timeToAnswerArray : number[] = []
        
        for (let j = 0; j < studentResults.length; j++) {
            const studentResult = studentResults[j];

            //CYCLE THROUGH THE TRIVIA DATAS OF EACH STUDENT TO SEE THE TOTAL NUMBER OF CORRECT AND INCORRECT ANSWERS FOR EACH QUESTIONS
            for (let k = 0; k < studentResult.triviaDatas.length; k++) {
                const triviaData = studentResult.triviaDatas[k];

                if(triviaData.question == dataIndex.triviaQuestion.question){
                    triviaData.correct? dataIndex.correctAnswers++ : dataIndex.incorrectAnswers++
                    timeToAnswerArray.push(triviaData.timeToAnswer)
                    break;
                } 
            }
        }

        //GET AVERAGE TIME TO ANSWER
        const sum = timeToAnswerArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        dataIndex.averageTimeToAnswer = sum / timeToAnswerArray.length;

        //ADD TO ARRAY AFTER CYCLING THROUGH THE QUESTION
        data.push(dataIndex)
    }

    return data
}

export const getStudentTriviaDatasResults = (triviaDatas : any[]) =>{
    let corrects : number = 0;
    let mistakes : number = 0;

    for (let i = 0; i < triviaDatas.length; i++) {
        const data = triviaDatas[i];
        data.correct? corrects++ : mistakes++
    }

    return {corrects, mistakes}
}

export const getStudentAverageTimePerQuestions = (triviaDatas : any[]) => {
    let sum : number = 0

    for (let i = 0; i < triviaDatas.length; i++) {
        const data = triviaDatas[i];
        sum += data.timeToAnswer
    }

    return Number((sum/triviaDatas.length).toFixed(2))
}

export const getTriviaQuestionsAverageTimeData = (studentResults : any[], triviaQuestions : any[]) => {

    //GET TRIVIA QUESTIONS RESULTS DATA USING THE GET FUNCTION
    const triviaQuestionResultsData = getTriviaQuestionResultsData(studentResults, triviaQuestions)
    const triviaQuestionsAverageTimeData : {questionNumber : string, triviaQuestion : TriviaQuestion, averageTimeToAnswer : number}[] = []

    //FILTER OUT THE ARRAY TO ONLY INCLUDE THE FOLLOWING FIELDS {QUESTION NUMBER, QUESTION, AVERAGE TIME TO ANSWER}
    for (let i = 0; i < triviaQuestionResultsData.length; i++) {
        const data = triviaQuestionResultsData[i];
        const averageTimeIndex = {questionNumber : data.questionNumber, triviaQuestion : data.triviaQuestion, averageTimeToAnswer : Number(data.averageTimeToAnswer.toFixed(2))}
        triviaQuestionsAverageTimeData.push(averageTimeIndex)
    }

    return triviaQuestionsAverageTimeData
}

export const getValuePercentage = (value : number, totalValue : number) => ((value/totalValue) * 100).toFixed(2)

export const sortStudentResults = (studentResults : any[]) => studentResults.sort((a, b) => b.totalGrade - a.totalGrade)