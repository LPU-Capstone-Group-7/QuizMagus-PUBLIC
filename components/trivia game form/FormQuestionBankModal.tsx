import { uuidv4 } from "@firebase/util"
import { doc, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Button, Card, Modal } from "react-bootstrap"
import { auth, db } from "../../src/firebase/firebaseConfig"
import { containsSubstring, containsTagSearches } from "../../src/utils"
import SearchInput from "../question bank/SearchInput"
import SearchTagInput from "../question bank/SearchTagInput"
import { TriviaQuestion } from "../../src/TriviaGame/TriviaGameObject"

export function inSelectedQuestionBanks(title : string, selectedQuestionBankTitles : string[]){
    let isIncluded : boolean = false
    if(!selectedQuestionBankTitles) return false
    
    selectedQuestionBankTitles.forEach(selectedTitle => {
        if(selectedTitle.toLowerCase() == title.toLowerCase()) isIncluded = true
    });

    return isIncluded
}

export default function FormQuestioBankModal({addQuestion, setAddQuestion, showQuestionBankModal, setShowQuestionBankModal}: 
                                            {addQuestion : any[], setAddQuestion : any, showQuestionBankModal : boolean, setShowQuestionBankModal : any}) {

    const [selectedQuestionBankTitles, setSelectedQuestionBankTitles] = useState<string[]>([])
    const [questionBankList, setQuestionBankList] = useState<any[]>([])

    const [searchInput, setSearchInput] = useState<string>('')
    const [searchTagInput, setSearchTagInput] = useState<string[]>([])
    const [tagList, setTagList] = useState<string[]>([])
    useEffect(() => {
        if(!auth.currentUser) return
        //GET USER'S QUESTION BANK LIST DOCUMENT REFERENCE
        const userQuestionBankListRef = doc(db,"triviaGameQuestionBank",auth.currentUser.uid)

        console.log(auth.currentUser.uid)
        //CREATE UNSUB LISTENER
        const unsub = onSnapshot(userQuestionBankListRef, (doc) => {
            if(doc.exists())
            setQuestionBankList(doc.data().questionBankList)
        });
        return () => unsub()
    },[])

    //ADDS EXISTING TAG TO TAG OPTIONS FOR THE FILTER SELECT DROPDOWN
  useEffect(() => {
    const tagArray : string[] = []
    questionBankList.length > 0 && questionBankList.map((questionBank) => {
      questionBank.tags && questionBank.tags.length > 0 && questionBank.tags.map((tag : any) => {
        !tagArray.includes(tag) && tagArray.push(tag)
      })
    })

    setTagList(tagArray)
  },[questionBankList])

    async function addQuestionsFromQuestionBank(event : any){
        event.preventDefault()

        if(!questionBankList) return

        const newQuestions : TriviaQuestion[] = [];
        for (let i = 0; i < questionBankList.length; i++) {

            const questionBankItem = questionBankList[i];

            //CHECK IF CURRENT QUESTION BANK INDEX IS INCLUDED IN THE LIST OF SELECTED QUESTION BANK
            if(inSelectedQuestionBanks(questionBankItem.title, selectedQuestionBankTitles)){

                //ADDS QUESTIONS FROM THE QUESTION BANK THAT ARE NOT INCLUDED IN THE CURRENT LIST OF QUESTIONS
                for (let i = 0; i < questionBankItem.questions.length; i++) {
                    const item = new TriviaQuestion(questionBankItem.questions[i].question, questionBankItem.questions[i].answer, questionBankItem.questions[i].difficulty, uuidv4())
                    let itemAlreadyExists : boolean = false

                    //CHECKS IF QUESTION IS ALREADY INCLUDED IN THE LIST OF QUESTIONS... IF NOT ADD IT INTO THE LIST
                    addQuestion.forEach(index => {
                        if(index.question.toLowerCase() == item.question.toLowerCase()){
                            itemAlreadyExists = true
                            return
                        }
                    })
                    !itemAlreadyExists && newQuestions.push(item)
                }
            }
            
        }

        setAddQuestion([...addQuestion, ...newQuestions].filter(currentIndex => currentIndex.question !== "" && currentIndex.answer !== ""))
        setShowQuestionBankModal(false)
    }

    function handleClose(){
        setSelectedQuestionBankTitles([])
        setSearchTagInput([])
        setShowQuestionBankModal(false)
    }
    
    return (
    <>
    <Modal show={showQuestionBankModal} centered = {true} onHide={handleClose}>
        <div className="trivia_form-modal-content">
            <div className="question-bank-header">
                <Modal.Header closeButton>
                <Modal.Title className = "h3_text color_secondary">Have a preferred topic? Choose below.</Modal.Title>
                </Modal.Header>
            </div>

            <div className="question-bank-body">
                <Modal.Body>
                    <div className = "flex-inline w-full px-5">
                        <SearchInput searchInput={searchInput} setSearchInput={setSearchInput}/>
                        <SearchTagInput searchTagInput= {searchTagInput} setSearchTagInput = {setSearchTagInput} tagList = {tagList} />
                    </div>
                    
                    {searchTagInput.map((tagItem: string, index: number) => (
                    <span key={index} className="search-tag h4-text font-bold">{tagItem}</span>))}

                    {questionBankList && questionBankList.length > 0 && questionBankList.map( questionBank =>
                    containsSubstring(questionBank.title, searchInput) && containsTagSearches(questionBank.tags, searchTagInput) && (
                        <QuestionBankModalItem title = {questionBank.title} key = {questionBank.title}
                            numberOfQuestions = {questionBank.numberOfQuestions} tags = {questionBank.tags}
                            selectedQuestionBankTitles = {selectedQuestionBankTitles}
                            setSelectedQuestionBankTitles = {setSelectedQuestionBankTitles}
                        />
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <div className="question-bank-add">
                        <Button onClick={(event) => addQuestionsFromQuestionBank(event)} >
                            Add Questions
                        </Button>
                    </div>
                </Modal.Footer>
            </div>
        </div>
    </Modal>
    </>
    )
}

export function QuestionBankModalItem({title, numberOfQuestions, tags, selectedQuestionBankTitles, setSelectedQuestionBankTitles} : 
                                    {title : string, numberOfQuestions : number, tags : string[], selectedQuestionBankTitles : string[], setSelectedQuestionBankTitles : any}){
    
    const [isSelected, setIsSelected] = useState<boolean>(inSelectedQuestionBanks(title, selectedQuestionBankTitles))
    
    function toggleQuestionBankItem(title : string){

        if(inSelectedQuestionBanks(title, selectedQuestionBankTitles)){
            setSelectedQuestionBankTitles((currentSelectedTitles : string[]) => 
                currentSelectedTitles.filter(selectedTitle => selectedTitle.toLowerCase() !== title.toLowerCase())
            )
            setIsSelected(false)
        }
        else{
            setSelectedQuestionBankTitles((currentSelectedTitles : string[]) =>
                [...currentSelectedTitles, title]
            )
            setIsSelected(true)
        }
    }

    return(<div className="questionBankModalItem">
        <div>
            <div className="card-body-design">
                <Card onClick={() => toggleQuestionBankItem(title)}>
                    <Card.Body className = {`playerModal_questionBankSelectorItem ${isSelected && "playerModal_questionBankSelectorItem_selected"}`}>
                        <h1>{title}</h1>
                        <div className="tag-item">
                            {tags.map((tag, key) => <p className = "h4-text" key = {key}> {tag} </p>)}
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </div>
    </div>)
                
}