import { doc, onSnapshot } from "firebase/firestore";
import { uuidv4 } from "@firebase/util";
import router from "next/router";
import { useEffect, useState } from "react";
import { Button, Form, InputGroup, ListGroup, Stack } from "react-bootstrap";
import { useAuth } from "../../components/AuthStateContext"
import LoadingPage from "../../components/LoadingPage";
import AddQuestionBankModal from "../../components/question bank/AddTriviaGameQuestionBankModal";
import { QuestionBankItemCard } from "../../components/question bank/QuestionBankItemCard";
import Navbar from "../../components/Navbar";
import { auth, db } from "../../src/firebase/firebaseConfig";
import SearchInput from "../../components/question bank/SearchInput";
import SearchTagInput from "../../components/question bank/SearchTagInput";
import { containsSubstring, containsTagSearches } from "../../src/utils";
import Modal from 'react-bootstrap/Modal';
import GPTQuestionBankModal from "../../components/question bank/openAI/GPTQuestionBankModal";

export default function TriviaGameQuestionBankPage() {

  //USER AUTHENTICATION TO MAKE SURE THE THE USER IS LOGGED IN WHEN CREATING THE GAME
  const{authUser, loading} = useAuth()

  const [questionBankList, setQuestionBankList] = useState<any[]>([])
  const [showAddQuestionBankModal, setShowAddQuestionBankModal] = useState<boolean>(false)

  const [searchInput, setSearchInput] = useState<string>('')
  const [searchTagInput, setSearchTagInput] = useState<string[]>([])
  const [tagList, setTagList] = useState<string[]>([])

  const [show, setShow] = useState(false);

  //GETS THE QUESTION BANK ITEMS FROM FIREBASE
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
  },[authUser])

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

  function hasQuestionBankWithSameTitle(title : string){
    if(!questionBankList || questionBankList.length == 0) return false
    for (let i = 0; i < questionBankList.length; i++) {
      if(questionBankList[i].title.toLowerCase() == title.toLowerCase()) return true
    }
    return false
  }

  if(loading){return <LoadingPage/>}
  if(!authUser){ router.push('/login'); return <LoadingPage/>}
  return (<>
    <title> Quiz Magus - Question Bank </title>
    <Navbar/>
      <div className="questionBankNav">
        <h1> Question Bank </h1>
        <div className="questionBankbuttons">
          <Button className = "questionBank_addButton" variant = "primary" onClick = {() => setShowAddQuestionBankModal(true)}>
            <svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 0v7.5H0v5h7.5V20h5v-7.5H20v-5h-7.5V0h-5z" fill="#6D1CFF" />
            </svg>
          </Button>
          <SearchInput searchInput={searchInput} setSearchInput={setSearchInput} />
          <SearchTagInput searchTagInput = {searchTagInput} setSearchTagInput = {setSearchTagInput} tagList = {tagList}/>
      </div>
    </div>

    <div className="questionBankcontent">
      <div className="displaytags_container">
        {searchTagInput.map((tagItem: string, index: number) => (
          searchTagInput.includes(tagItem) && <p key={index} className="search-tag h4-text font-bold">{tagItem}</p>))}
      </div>

    <ListGroup style={{ marginLeft : 'auto', marginRight : 'auto', width : '60rem' }}>
        <Stack gap={3}>
            {questionBankList && questionBankList.length > 0 && questionBankList.map( questionBank => 
              containsSubstring(questionBank.title, searchInput) && 
              containsTagSearches(questionBank.tags, searchTagInput) && (
                  <QuestionBankItemCard
                  key ={questionBank.title}
                  title = {questionBank.title} numberOfQuestions = {questionBank.numberOfQuestions} 
                  tags = {questionBank.tags??[]}
                  lastUpdated = {questionBank.lastUpdated} questions = {questionBank.questions} 
                  questionBankList = {questionBankList} questionBankIndex = {questionBankList.indexOf(questionBank)}
                  hasQuestionBankWithSameTitle = {hasQuestionBankWithSameTitle}
                />
              )
            )}
        </Stack>
    </ListGroup>
    
    <AddQuestionBankModal
      showAddQuestionBankModal = {showAddQuestionBankModal} setShowAddQuestionBankModal = {setShowAddQuestionBankModal}
      defaultTitle = {''} defaultAddQuestion = {[{ question: '', answer: '',difficulty: 'easy', id: uuidv4(),}]} 
      defaultTags = {[]}
      hasQuestionBankWithSameTitle = {hasQuestionBankWithSameTitle}
    />

      {/*AI QUESTION BANK SHOW BUTTON AND MODAL*/}
      {/* <div className="questionbank-button">
      <Button className="question-bank" variant="primary" onClick={() => setShow(true)}> AI Question Bank</Button>
        </div> */}
    </div>

    {/* <GPTQuestionBankModal show = {show} setShow = {setShow} hasQuestionBankWithSameTitle = {hasQuestionBankWithSameTitle}/> */}
  </>)
}

