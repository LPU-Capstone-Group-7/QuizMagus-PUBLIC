import { v4 as uuidv4 } from 'uuid';
import { useEffect, useRef, useState } from 'react';
import { Accordion, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import SuggestionIntellisense from '../question bank/SuggestionsQuestionBank/SuggestionIntellisense';
import { auth, db } from "../../src/firebase/firebaseConfig";
import { doc, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../AuthStateContext';

export default function AddQuestion({addQuestion, setAddQuestion, addIntellisense = false} : {addQuestion : any[], setAddQuestion : any, addIntellisense? : boolean}) {

    const{authUser, loading} = useAuth()
    const [questionBankItems, setQuestionBankItems] = useState<any[]>([])
    
    useEffect(() => {
        if(!auth.currentUser) return
        //GET USER'S QUESTION BANK LIST DOCUMENT REFERENCE
        const userQuestionBankListRef = doc(db,"triviaGameQuestionBank",auth.currentUser.uid)
        console.log(auth.currentUser.uid)
        //CREATE UNSUB LISTENER
        const unsub = onSnapshot(userQuestionBankListRef, (doc) => {
            if(doc.exists()){

            setQuestionBankItems(doc.data().questionBankList)
            const questionBankQuestions: any[] = [];
                doc.data().questionBankList.map((questionBank: any) => (
                questionBank.questions.map((question: any) => questionBankQuestions.push(question))
                ));
                setQuestionBankItems(questionBankQuestions);
            }
        });
        return () => unsub()
    },[authUser])


    const [onAccordionChange, setOnAccordionChange] = useState<boolean>(false);
    const [selectedKey, setSelectedKey] = useState<any>()
    
    // ADD NEW QUESTION AND ANSWER IN FORM
    const addQuestionRow = (member : any) => {

        //GET ARRAY INDEX OF ACCORDION MEMBER
        let _addQuestion=[...addQuestion]
        const insertIndex : number = _addQuestion.indexOf(member)

        //INSERT NEW ITEM AFTER THE MEMBER INDEX
        _addQuestion.splice(insertIndex + 1, 0, {
            question: "",
            answer: "",
            difficulty: "easy",
            id: uuidv4()
        })
        setAddQuestion(_addQuestion)
        setOnAccordionChange(state => !state)
        setSelectedKey(insertIndex + 1)
    }

    // REMOVE ADDITIONAL QUESTION AND ANSWER IN FORM
    const removeQuestionRow = (id:string) => {
        // Todo generate random id

        let _addQuestion=[...addQuestion]
        _addQuestion=_addQuestion.filter(member=>member.id!==id)
        setAddQuestion(_addQuestion)
        setOnAccordionChange(state => !state)
    }

    //HANDLE EMAIL ROW CHANGE
    const handleMemberChange = (id: string, targetName: string, targetValue: string) => {
        // Find the index to be changed using the member ID
        const index = addQuestion.findIndex(m => m.id === id);

        // Create a copy of addQuestion array
        let _addQuestion = [...addQuestion] as any;

        // Change the value of the specific field depending on the target name
        _addQuestion[index][targetName] = targetValue;

        // Update the state with the modified array
        setAddQuestion(_addQuestion);
      };

    

  return (
    <div className = "addQuestionsInput">
        <Accordion activeKey={selectedKey} onSelect={(activeKey) => {setSelectedKey(activeKey)}}>
            {addQuestion.map(member => ( //USED BOOTSTRAP BUILT IN LAYOUT LAYOUT 
            <Container key = {member.id}>
                <Row>
                    <Col>
                        <QuestionInputAccordion handleMemberChange = {handleMemberChange} addQuestionItem = {member} eventKey = {addQuestion.indexOf(member)} onAccordionChange = {onAccordionChange} selectedKey = {selectedKey} questionBankItems = {questionBankItems} addIntellisense = {addIntellisense}/>
                    </Col>
                    <Col id="buttonscontainer" xs="auto">
                        <div className="container_button">
                        <Button variant='primary' type='button' onClick={() => {addQuestionRow(member)}}>+</Button>
                        <Button variant = 'primary' type = 'button' 
                        onClick={() => {addQuestion.length > 1? removeQuestionRow(member.id) : toast.error("Must atleast have one question")}}>-</Button>
                        </div>
                    </Col>
                </Row>
            </Container>))}
        </Accordion>
    </div>
  )
}

interface QuestionInputAccordionProps{
    handleMemberChange: any; 
    eventKey: any; 
    addQuestionItem: any; 
    onAccordionChange: any;
    selectedKey: any;
    questionBankItems: any[];
    addIntellisense : boolean;
}

export function QuestionInputAccordion({handleMemberChange, eventKey, addQuestionItem, onAccordionChange, selectedKey, questionBankItems, addIntellisense} : QuestionInputAccordionProps){

    const [accordionHeader, setAccordionHeader] = useState(`Question #${eventKey + 1}`)
    const showQuestionInHeader = () => setAccordionHeader(`${eventKey + 1}. ${addQuestionItem.question}`)
    const showQuestionNumberInHeader = () => setAccordionHeader(`Question #${eventKey + 1}`)
    const maximumCharacter = 100

    const [isFocused, setIsFocused] = useState<boolean>(false);

    useEffect(() =>{
        addQuestionItem.question? showQuestionInHeader() : showQuestionNumberInHeader()
    },[onAccordionChange])

    useEffect(() => {
        eventKey != selectedKey && addQuestionItem.question && showQuestionInHeader()
    },[addQuestionItem.question])

    function changeMemberFields(item : {question : string, answer : string, diffficulty : string}){
        handleMemberChange(addQuestionItem.id, "question", item.question)
        handleMemberChange(addQuestionItem.id, "answer", item.answer)
        handleMemberChange(addQuestionItem.id, "difficulty", item.diffficulty)
    }

    const handleFocus = async () => {
        await delay(250); // 0.1 seconds delay
        setIsFocused(true);
  };
    
    const handleBlur = async () => {
        await delay(250); // 0.1 seconds delay
        setIsFocused(false);
    };

    const delay = (ms: number) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    };
    

return(
        <Accordion.Item eventKey= {eventKey}>
        <div className={`accordion-header ${addQuestionItem.difficulty=== 'hard' ? 'hard-header' : 
        (addQuestionItem.difficulty === 'normal' ? 'normal-header' : 'easy-header')}`}>
            <Accordion.Header>
                {accordionHeader}
            </Accordion.Header>
        </div>
        <Accordion.Body onExiting={() => {addQuestionItem.question && showQuestionInHeader()}} onEntered ={() => showQuestionNumberInHeader()}>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Question</Form.Label>
                    <Form.Control type="text" name = "question" maxLength={maximumCharacter} value = {addQuestionItem.question} onFocus={handleFocus} onBlur = {handleBlur} onChange = {(event) => handleMemberChange(addQuestionItem.id, event.target.name, event.target.value)}
                    className={addQuestionItem.question.length > maximumCharacter ? "question_error" : ""}/>
                    {addQuestionItem.question.length >= maximumCharacter && <h6> Minimum of {maximumCharacter} characters only </h6>}
                { addIntellisense && isFocused && <SuggestionIntellisense question={addQuestionItem.question} addQuestion={questionBankItems} changeMemberFields = {changeMemberFields} />}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Answer</Form.Label>
                    <Form.Control type="text" name = "answer" value = {addQuestionItem.answer} onChange = {(event) => handleMemberChange(addQuestionItem.id, event.target.name, event.target.value)}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Difficulty</Form.Label>
                    <Form.Select aria-label="Default select example" name = "difficulty" value={addQuestionItem.difficulty} onChange = {(event) => handleMemberChange(addQuestionItem.id, event.target.name, event.target.value)}>
                        <option value="easy">Easy</option>
                        <option value="normal">Normal</option>
                        <option value="hard">Hard</option>
                    </Form.Select>
                </Form.Group>
                
            </Form>
        </Accordion.Body>
        </Accordion.Item>
)
}
