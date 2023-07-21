import React, { useEffect } from "react"
import { v4 as uuidv4 } from 'uuid';
import Navbar from "../../../components/Navbar";
import { useState } from 'react';
import { TriviaGameSettings, TriviaQuestion, validateTriviaGameSettings } from "../../../src/TriviaGame/TriviaGameObject";
import { auth, db, addCustomizedGameData, addCustomizedGameDataSnippet } from "../../../src/firebase/firebaseConfig";
import HintsToggle from "../../../components/trivia game form/HintsToggle";
import RandomizeQuestionsToggle from "../../../components/trivia game form/RandomizeQuestionsToggle";
import StartEndDateSelect from "../../../components/trivia game form/StartEndDateSelect";
import AddQuestionsInput from "../../../components/trivia game form/AddQuestionsInput";
import LoadingPage from "../../../components/LoadingPage";
import router from "next/router";
import { useAuth } from "../../../components/AuthStateContext";
import { toast } from 'react-toastify';
import GradingSystemInput from "../../../components/trivia game form/GradingSystemInput";
import { changeToTitleCase, setCurrentUserAsAuthor, titleAlreadyExists, validateGeneralGameSettings } from "../../../src/utils";
import TitleInput from "../../../components/trivia game form/TitleInput";
import SubmitPopUp from "../../../components/customized game/SubmitPopUp";
import SubmitButton from "../../../components/SubmitButton";
import QuestionBankFormModalButton from "../../../components/question bank/QuestionBankFormModalButton";
import ClassEntrySelect from "../../../components/trivia game form/ClassEntrySelect";


export default function DynamicForm(){
    
    //USER AUTHENTICATION TO MAKE SURE THE THE USER IS LOGGED IN WHEN CREATING THE GAME
    const{authUser, loading} = useAuth()
    const [author, setAuthor] = useState<{name : string, id : string}>({id : '', name : ''})
    
    const[isLoading, setIsLoading] = useState<boolean>(false)

    //USE STATE FOR STORING TRIVIA GAME QUESTIONS
    const [addQuestion, setAddQuestion] = useState([
        {
            question: '',
            answer: '',
            difficulty: '',
            id: uuidv4(),
        },
    ])

    const [triviaQuestionBank, setTriviaQuestionBank] = useState<TriviaQuestion[]>([])
    const [title, setTitle] = useState(''); // TITLE
    const [classEntry, setClassEntry] = useState<string>('')
    const [basedGrading, setBasedGrading] = useState('0'); //BASED GRADING
    const [customizedGameLink, setcustomizedGameLink] =useState<{title : string, id : string}>({title : '', id : ''});
    const [enableHints, setEnableHints] = useState<boolean>(false) // ENABLE HINTS
    const [enableRandomize, setEnableRandomize] = useState<boolean>(false) // ENABLE RANDOMIZE
    const [time, setTime] = useState<number>(0); // MINIMUM TIME LIMIT
    const [allowedAttempts, setAllowedAttempts] = useState<number>(0); // ALLOW ATTEMPTS
    const [startDate, setStartDate] = useState<Date>(new Date()); // START DATE
    const [endDate, setEndDate] = useState<Date>(new Date()); // END DATE
    const [showQuestionBankModal, setShowQuestionBankModal] = useState<boolean>(false)
    const [show, setShow] = useState(false); // MODAL POP UP

    //GET THE AUTH USER'S USERNAME
    useEffect(() => {
        if (auth.currentUser !== null) {
            setCurrentUserAsAuthor(auth.currentUser.uid, setAuthor);
        }
        return () => {}; 
    }, [auth.currentUser]);

    //HANDLE SUBMIT 
    async function handleSubmit (){

        setIsLoading(true)
        const titleExists : boolean = await titleAlreadyExists(title)

        try {

            //CREATE TRIVIA QUESTIONS OBJECT
            let triviaQuestions : TriviaQuestion[] = []
            for(let i = 0; i < addQuestion.length; i++){
                triviaQuestions.push(new TriviaQuestion(addQuestion[i].question, addQuestion[i].answer, addQuestion[i].difficulty, addQuestion[i].id))
            }

            //VALIDATE INPUTTED GAME SETTINGS
            const generalGameSettingsValidation = validateGeneralGameSettings(title, basedGrading, allowedAttempts, startDate, endDate)
            const triviaGameSettingsValidation = validateTriviaGameSettings(triviaQuestions, time, enableHints, enableRandomize)

            //IF INPUT IS VALID THEN ADD THE CUSTOMIZED GAME DATA INTO FIREBASE
            if(generalGameSettingsValidation.isValid && triviaGameSettingsValidation.isValid && !titleExists){

                const triviaGameSettings : TriviaGameSettings = new TriviaGameSettings(triviaQuestions, time, enableHints, enableRandomize, basedGrading)
                const jsonString: string = JSON.stringify(triviaGameSettings);

                addCustomizedGameData(
                    title,
                    classEntry,
                    basedGrading,
                    allowedAttempts,
                    author,
                    startDate,
                    endDate,
                    jsonString,
                    "TriviaGame",).then((id:string) =>  {
                        addCustomizedGameDataSnippet(id, changeToTitleCase(title), startDate, endDate, "TriviaGame") 
                        setcustomizedGameLink({title : title, id : id})
                        setShow(true)
                        setIsLoading(false)
                    })
            }
            else{
                if(titleExists) throw "Title already Exists"
                const errorMessage = generalGameSettingsValidation.message !== ''? generalGameSettingsValidation.message : triviaGameSettingsValidation.message
                throw errorMessage
            }
            
        } catch (error) {
            toast.error(error as string);
            console.log(error)
            setIsLoading(false)
        }
    }

    
    if(loading){return <LoadingPage/>}
    if(!authUser){ router.push('/login'); return <LoadingPage/>}
return (
    <div className="forms_div">
        <title> Create Trivia Game </title>
        <Navbar/>
        <div className="container_form">
            <div className="dynamic-form">
                <div className="dynamic_form_head">
                    <h1> Trivia Form </h1>
                    <h2> Please fill in the required information </h2>
                </div>

                {/* GAME TITLE INPUT FIELD */}
                <TitleInput title = {title} setTitle  = {setTitle}/>

                {/* ASSIGN CLASS SELECT FIELD */}
                <ClassEntrySelect classEntry = {classEntry} setClassEntry = {setClassEntry} userUID= {auth.currentUser?.uid ?? ''}/>

                {/* GRADING SYSTEM INPUT FIELD*/}
                <GradingSystemInput basedGrading = {basedGrading} setBasedGrading = {setBasedGrading}/> 

                {/* BOOLEAN RADIO BUTTON COMPONENTS */}
                <HintsToggle enableHints = {enableHints} setEnableHints = {setEnableHints}/>
                <RandomizeQuestionsToggle enableRandomize = {enableRandomize} setEnableRandomize = {setEnableRandomize}/>

                {/* TIME PER QUESTION INPUT FIELD*/}
                <div className="time_form">
                    <label> Time per Question (Seconds) </label>
                    <input type="number" min={1} value={time} onChange={event => setTime(Number(event.target.value))} />
                </div>

                {/* ALLOWED ATTEMPTS INPUT FIELD*/}
                <div className="allowed_attempts">
                    <label> Allowed Attempts (min: 1) </label>
                    <input name="number_attempts" type="number" value={allowedAttempts} min={1} onChange={event => setAllowedAttempts(Number(event.target.value))}/>
                </div>

                {/* START AND END DATE SELECTION COMPONENT */}
                <StartEndDateSelect
                    startDate = {startDate} setStartDate = {setStartDate}
                    endDate = {endDate} setEndDate = {setEndDate}
                />

                {/*QUESTIONS INPUT FIELD */}
                <AddQuestionsInput addQuestion= {addQuestion} setAddQuestion = {setAddQuestion} />

                {/* SUBMIT BUTTON */}
                <div className="submit_form">
                <SubmitButton isLoading={isLoading} handleSubmit={handleSubmit} name={"Submit Form"} />
                </div>

                {/*POP UP MODAL AFTER SUBMITTING FORM */}
                <SubmitPopUp show={show} setShow={setShow} customizedGameLink={customizedGameLink} />
            </div>
        </div>

        {/*QUESTION BANK SHOW BUTTON AND MODAL*/}
        <QuestionBankFormModalButton
            showQuestionBankModal = {showQuestionBankModal} setShowQuestionBankModal={setShowQuestionBankModal}
            addQuestions={addQuestion} setAddQuestions={setAddQuestion}
        />
    </div>
    )
}