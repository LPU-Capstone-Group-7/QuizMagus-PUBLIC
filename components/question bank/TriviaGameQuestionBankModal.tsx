import { useState } from "react"
import { Modal, Form, Button } from "react-bootstrap"
import { toast } from "react-toastify"
import AddQuestionsInput from "../trivia game form/AddQuestionsInput"
import QuestionBankTitleInput from "./QuestionBankTitleInput"
import TagsInput from "./TagsInput"

export default function TriviaGameQuestionBankModal({showQuestionBankModal, setShowQuestionBankModal, title, setTitle, addQuestion, setAddQuestion, submitHandler, loading, tags, setTags} : 
    {showQuestionBankModal : any, setShowQuestionBankModal : any, title : string, setTitle : any, addQuestion : any[], setAddQuestion : any, submitHandler : any, loading : boolean, tags : string[], setTags: any}){

    const [originalTitle, setOriginalTitle] = useState<string>(title)
    const [originalAddQuestion, setOriginalAddQuestion] = useState<any[]>(addQuestion)
    const [originalTags, setOriginalTags] = useState<string[]>(tags)

    async function validateSubmit(event : any){
        event.preventDefault()
        try{
            //VALIDATE INPUTS FIRST
            if(!title) throw 'missing title'
            for (var i = 0; i < addQuestion.length; i++) { if (addQuestion[i].question == "" || addQuestion[i].answer == "") throw 'Question and Answer must both have an input'}

            //CALL THE SUBMIT HANDLER FUNCTION
            submitHandler(event)
        }
        catch(error){
            toast.error(error as string)
        }
    }

function onHideAction(){
    setShowQuestionBankModal(false)
    setTitle(originalTitle)
    setAddQuestion(originalAddQuestion)
    setTags(originalTags)
}

function onEnterAction(){
    setOriginalAddQuestion(addQuestion)
    setOriginalTitle(title)
    setOriginalTags(tags)
}

    return( <>
        <Modal show={showQuestionBankModal} centered = {true} onEnter = {() => onEnterAction()} onHide={() => onHideAction()} className = "addQuestionBankModal">
        <div className="question_bank-modal-content">
            <div className="bank_header">
                <Modal.Header closeButton>
                    <Modal.Title>Add your own Questions </Modal.Title>
                </Modal.Header>
            </div>
                <Modal.Body>
                    {/* TITLE INPUT FIELD FOR QUESTION BANK */}
                    <Form> 
                        <QuestionBankTitleInput title = {title} setTitle = {setTitle}/>
                        <TagsInput tags = {tags} setTags = {setTags} />
                    </Form>
                    {/* QUESTION ITEMS FOR QUESTION BANK */}
                    <AddQuestionsInput addQuestion = {addQuestion} setAddQuestion = {setAddQuestion} addIntellisense = {true}/> 
                </Modal.Body>
                <Modal.Footer>
                    <div className="submit">
                        <Button id="modal_submit" variant="primary" onClick={(event) => validateSubmit(event)} disabled = {loading}>
                            Submit
                        </Button>
                    </div>
                </Modal.Footer>
            </div>
        </Modal>
    </>)
}