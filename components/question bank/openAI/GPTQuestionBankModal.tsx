import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { auth } from '../../../src/firebase/firebaseConfig'
import { submitQuestionBankQuery } from '../../../src/questionBank_utils'
import AddQuestion from '../../trivia game form/AddQuestionsInput'
import QuestionBankTitleInput from '../QuestionBankTitleInput'
import TagsInput from '../TagsInput'
import PromptInput from './PromptInput'

export default function GPTQuestionBankModal({show, setShow, hasQuestionBankWithSameTitle} : {show : boolean, setShow : any, hasQuestionBankWithSameTitle : any}) {
    
    const [title, setTitle] = useState<string>('')
    const [tags, setTags] = useState<string[]>([])
    const [promptInput, setPromptInput] = useState<string>('')
    const [addQuestion, setAddQuestion] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    async function submitHandler(event : any){
        if(!auth.currentUser) return;

        await submitQuestionBankQuery(event, auth.currentUser.uid, setLoading, setShow, hasQuestionBankWithSameTitle, title, tags, addQuestion).
        then( () => {//CLEAN UP THE STATES 
            clearStates()
        })
    }

    function clearStates(){
        console.log("Cleared")
        setTitle('')
        setTags([])
        setAddQuestion([])
        setPromptInput('')
    }

  return (
    <Modal show={show} onHide={() => {setShow(false); clearStates()}} centered>
        <div className="view_modal question_bank-modal-content">
            <Modal.Header closeButton>
                <Modal.Title className = "capitalize">Create questions using openAI </Modal.Title>
            </Modal.Header>
            <Modal.Body className = "flex-column">
                <QuestionBankTitleInput title = {title} setTitle = {setTitle}/>
                <TagsInput tags = {tags} setTags = {setTags}/>
                <PromptInput promptInput= {promptInput} setPromptInput = {setPromptInput} addQuestion={ addQuestion} setAddQuestion = {setAddQuestion}/>
                <AddQuestion addQuestion={addQuestion} setAddQuestion = {setAddQuestion}/>
            </Modal.Body>
            <Modal.Footer>
                    <div className="submit">
                        <Button id="modal_submit" variant="primary" onClick={(event) => submitHandler(event)} disabled = {loading}>
                            Submit
                        </Button>
                    </div>
                </Modal.Footer>
        </div>
    </Modal>
  )
}
