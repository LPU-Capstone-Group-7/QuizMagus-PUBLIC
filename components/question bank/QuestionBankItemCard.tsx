import { uuidv4 } from "@firebase/util"
import { doc, updateDoc, arrayRemove, setDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Button } from "react-bootstrap"
import { toast } from "react-toastify"
import { auth, db } from "../../src/firebase/firebaseConfig"
import AddTriviaGameQuestionBankModal from "./AddTriviaGameQuestionBankModal"
import { dateToStringFormat } from "../../src/utils"
import TriviaGameQuestionBankModal from "./TriviaGameQuestionBankModal"

export function QuestionBankItemCard({title, numberOfQuestions, lastUpdated, questions, questionBankList, questionBankIndex , hasQuestionBankWithSameTitle, tags} : 
                                    {title : string, numberOfQuestions : number, lastUpdated : any, questions : any[], questionBankList : any[], questionBankIndex : number, hasQuestionBankWithSameTitle : any, tags : string[]}){

    const [questionBankItemTitle, setQuestionBankItemTitle] = useState<string>(title)
    const [questionBankItemQuestions, setQuestionBankItemQuestions] = useState<any[]>(questions)
    const [showEditQuestionBankModal, setShowEditQuestionBankModal] = useState<boolean>(false)
    const [showDuplicateQuestionBankModal, setShowDuplicateQuestionBankModal] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [questionBankItemTags, setQuestionBankItemTags] = useState<string[]>(tags)

    //CREATES QUESTION BANK ITEM QUESTION WITH ID
    useEffect(() => {
        if(!questions) return

        //CREATE AN ARRAY OF QUESTIONS THAT CONTAINS AN ID FOR THE EDIT QUESTION BANK MODAL
        const questionsArray = questions.map((item) => ({question : item.question, answer: item.answer, difficulty : item.difficulty, id : uuidv4()}))
        setQuestionBankItemQuestions(questionsArray)
    },[])
  
    //DELETES QUESTION BANK ITEM FROM THE LIST
    async function deleteQuestionBankItem(title : string){
        if(!auth.currentUser) return
        
        try{
            //REMOVE QUESTION BANK INDEX FROM THE ARRAY
            const questionBankDocRef = doc(db, "triviaGameQuestionBank", auth.currentUser.uid)
            const addQuestionBankDoc = await updateDoc(questionBankDocRef,{
                questionBankList : arrayRemove(questionBankList[questionBankIndex]) 
            })

            toast.success("Deleted Successfully")
        }
        catch(error){
            toast.error("Something went wrong")
        }
    }
    
    //OVERWRITES THE WHOLE QUESTION BANK LIST OF THE USER LOLZ.... NOT SURE IF THIS IS EFFICIENT
    async function editQuestionBankSubmitHandler(event : any){
        if(!auth.currentUser) return
        event.preventDefault()
        setIsLoading(true)

        const editedQuestionBankIndex = {
            title : questionBankItemTitle,
            lastUpdated : new Date(),
            numberOfQuestions : questionBankItemQuestions.length,
            tags : questionBankItemTags,
            questions : questionBankItemQuestions.map((item) => ({question : item.question, answer: item.answer, difficulty : item.difficulty})),
        }

        const madeChanges : boolean = title.toLowerCase() != editedQuestionBankIndex.title.toLowerCase() || JSON.stringify(questions) !== JSON.stringify(editedQuestionBankIndex.questions)
        if(!madeChanges) {
            //EXIT OUT OF THE MODAL
            setShowEditQuestionBankModal(false)
            setIsLoading(false)
            return
        }

        try{
            //VALIDATE TITLE IF IT HAS SIMILARITIES WITH OTHER TITLE
            if(title.toLowerCase() !== editedQuestionBankIndex.title.toLowerCase() && hasQuestionBankWithSameTitle(editedQuestionBankIndex.title)) throw 'Title Already Exists'
    
            //USING THE INDEX OF THE QUESTION BANK ITEM REPLACE THE INDEX WITH THE NEW INDEX WITH THE EDITED CHANGE
            let array : any[] = questionBankList
            array[questionBankIndex] = editedQuestionBankIndex
    
            //OVERWRITE THE QUESTION BANK LIST IN FIREBASE
            const questionBankDocRef = doc(db, "triviaGameQuestionBank", auth.currentUser.uid)
            const addQuestionBankDoc = await setDoc(questionBankDocRef,{
                questionBankList : array 
            })
    
            //EXIT OUT OF THE MODAL
            setShowEditQuestionBankModal(false)
            setIsLoading(false)
            toast.success("Saved Changes")
        }
        catch(error){
            toast.error(error as string)
            setIsLoading(false)
            console.log(error)
        }

    }
  
      return(
          <>
            <div className="card_container">
              <div className="cardfirst_column">
                <div className="card_icon"></div>
              </div>
              <div className="cardsecond_column">
                <h1>{title}</h1>
                <br/>
                <h2>{numberOfQuestions} Questions</h2>
                <br/>
                <div className="tag-item">
                {tags.map((tag) => <p key = {tag}> {tag} </p>)}
                </div>
              </div>
              <div className="cardthird_column">
                <div className="listitem_buttons">
                  <Button onClick = {() => { setShowDuplicateQuestionBankModal(true)}}>
                    <svg width={26} height={28} fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M.857.153v27.694h24.232V14H11.242V.153H.857zm13.847 0v10.385h10.385L14.704.153z" fill="#6D1CFF"/>
                    </svg>
                  </Button>
                  <Button onClick = {() => { setShowEditQuestionBankModal(true)}}>
                    <svg width={25} height={26} fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18.13.973L15.123 3.98l6.013 6.013 3.007-3.007L18.129.973zm-6.014 6.013L.089 19.013v6.014h6.014L18.13 13l-6.014-6.014z" fill="#6D1CFF"/>
                    </svg>
                  </Button>
                  <Button onClick = {() => {deleteQuestionBankItem(title)}}>
                    <svg width="25" height="28" viewBox="0 0 25 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.4287 0.285767C8.54296 0.285767 7.0001 1.82862 7.0001 3.71434H3.57153C1.68582 3.71434 0.14296 5.25719 0.14296 7.14291H24.143C24.143 5.25719 22.6001 3.71434 20.7144 3.71434H17.2858C17.2858 1.82862 15.743 0.285767 13.8572 0.285767H10.4287ZM3.57153 10.5715V27.0629C3.57153 27.4401 3.84582 27.7143 4.22296 27.7143H20.0972C20.4744 27.7143 20.7487 27.4401 20.7487 27.0629V10.5715H17.3201V22.5715C17.3201 23.5315 16.5658 24.2858 15.6058 24.2858C14.6458 24.2858 13.8915 23.5315 13.8915 22.5715V10.5715H10.463V22.5715C10.463 23.5315 9.70867 24.2858 8.74867 24.2858C7.78867 24.2858 7.03439 23.5315 7.03439 22.5715V10.5715H3.60582H3.57153Z" fill="#6D1CFF"/>
                    </svg>
                  </Button>
                </div>
                <p>{dateToStringFormat(lastUpdated.toDate())}</p>
              </div>
            </div>
        
            {/* MODAL FOR EDITING QUESTION BANK */}
            <TriviaGameQuestionBankModal 
                showQuestionBankModal = {showEditQuestionBankModal} setShowQuestionBankModal = {setShowEditQuestionBankModal}
                title = {questionBankItemTitle} setTitle = {setQuestionBankItemTitle} addQuestion = {questionBankItemQuestions} setAddQuestion = {setQuestionBankItemQuestions} 
                tags = {questionBankItemTags} setTags = {setQuestionBankItemTags}
                submitHandler = {editQuestionBankSubmitHandler} loading = {isLoading}
            />

            {/* MODAL FOR DUPLICATING QUESTION BANK */}
            <AddTriviaGameQuestionBankModal 
                showAddQuestionBankModal = {showDuplicateQuestionBankModal} setShowAddQuestionBankModal = {setShowDuplicateQuestionBankModal}
                defaultTitle = {title} defaultAddQuestion = {questionBankItemQuestions} 
                defaultTags = {tags}
                hasQuestionBankWithSameTitle = {hasQuestionBankWithSameTitle}
                />
        </>
      )
  }