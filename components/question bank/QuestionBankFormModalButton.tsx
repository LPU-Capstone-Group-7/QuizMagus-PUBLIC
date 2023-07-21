import React from 'react'
import { Button } from 'react-bootstrap'
import FormQuestioBankModal from '../trivia game form/FormQuestionBankModal'
import { TriviaQuestion } from '../../src/TriviaGame/TriviaGameObject'

interface props{
    showQuestionBankModal : boolean,
    setShowQuestionBankModal : any,
    addQuestions : TriviaQuestion[],
    setAddQuestions : any,
}
export default function QuestionBankFormModalButton({showQuestionBankModal, setShowQuestionBankModal, addQuestions , setAddQuestions} : props) {
  return (
    <div className="questionbank-button">
        <Button className="question-bank" onClick = {() => setShowQuestionBankModal(true)}> Question Bank</Button>
        <FormQuestioBankModal
            addQuestion={addQuestions} setAddQuestion = {setAddQuestions}
            showQuestionBankModal = {showQuestionBankModal} setShowQuestionBankModal = {setShowQuestionBankModal}
        />
    </div>
  )
}
