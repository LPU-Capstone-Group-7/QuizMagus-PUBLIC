import router from 'next/router';
import Navbar from "../../../components/Navbar";
import { useAuth } from '../../../components/AuthStateContext';
import LoadingPage from '../../../components/LoadingPage';
import React, { useState, useEffect } from 'react';
import TitleInput from '../../../components/trivia game form/TitleInput';
import GradingSystemInput from '../../../components/trivia game form/GradingSystemInput';
import StartEndDateSelect from '../../../components/trivia game form/StartEndDateSelect';
import { toast } from 'react-toastify';
import { changeToTitleCase, setCurrentUserAsAuthor, titleAlreadyExists, validateGeneralGameSettings } from '../../../src/utils';
import { addCustomizedGameData, addCustomizedGameDataSnippet, auth } from '../../../src/firebase/firebaseConfig';
import ReverseWord from '../../../components/word search form/ReverseWord';
import DiagonalWord from '../../../components/word search form/DiagonalWord';
import HintsToggle from '../../../components/trivia game form/HintsToggle';
import AddQuestionsInput from "../../../components/trivia game form/AddQuestionsInput";
import { v4 as uuidv4 } from 'uuid';
import { TriviaQuestion } from '../../../src/TriviaGame/TriviaGameObject';
import { WordSearchSettings, validateWordSearchSettings } from '../../../src/WordSearch/WordSearchObject';
import SubmitPopUp from '../../../components/customized game/SubmitPopUp';
import SubmitButton from '../../../components/SubmitButton';
import QuestionBankFormModalButton from '../../../components/question bank/QuestionBankFormModalButton';
import ClassEntrySelect from '../../../components/trivia game form/ClassEntrySelect';



export default function WordSearchForm() {
    //USER AUTHENTICATION TO MAKE SURE THE THE USER IS LOGGED IN WHEN CREATING THE GAME
    const{authUser, loading} = useAuth()

    const[isLoading, setIsLoading] = useState<boolean>(false)

    //USE STATE FOR STORING WORD SEARCH QUESTIONS
    const [addQuestion, setAddQuestion] = useState([
        {
            question: '',
            answer: '',
            difficulty: '',
            id: uuidv4(),
        },
    ])

    const [title, setTitle] = useState(''); // TITLE
    const [classEntry, setClassEntry] = useState<string>('')
    const [basedGrading, setBasedGrading] = useState('0'); //BASED GRADING
    const [startDate, setStartDate] = useState<Date>(new Date()); // START DATE
    const [endDate, setEndDate] = useState<Date>(new Date()); // END DATE
    const [author, setAuthor] = useState({ id: "", name: "" });
    const [timeLimit, setTimeLimit] = useState<number>(0); // MINIMUM TIME LIMIT
    const [enableRandomize, setEnableRandomize] = useState<boolean>(false) // ENABLE RANDOMIZE
    const [allowedAttempts, setAllowedAttempts] = useState<number>(1); // ALLOW ATTEMPTS
    const [enableHints, setEnableHints] = useState<boolean>(false) // ENABLE HINTS


    // WORD SEARCH UNIQUE FIELDS
    const [allowBackwards, setAllowBackwards] = useState<boolean>(false) // ENABLE REVERSED WORDS
    const [allowDiagonals, setAllowDiagonals] = useState<boolean>(false) // ENABLE DIAGONAL WORDS
    const [maxNumOfChoices, setmaxNumOfChoices] = useState<number>(0); // MINIMUM TIME LIMIT

    const [customizedGameLink, setcustomizedGameLink] =useState<{title : string, id : string}>({title : '', id : ''});
    const [show, setShow] = useState(false); // MODAL POP UP
    const [showQuestionBankModal, setShowQuestionBankModal] = useState<boolean>(false)



    //GET THE AUTH USER'S USERNAME
    useEffect(() => {
        if (auth.currentUser !== null) {
            setCurrentUserAsAuthor(auth.currentUser.uid, setAuthor);
        }
        return () => {}; 
    }, [auth.currentUser]);
    
    // HANDLE SUBMIT
    async function handleSubmit (){ 

        setIsLoading(true)
        const titleExists : boolean = await titleAlreadyExists(title)

        try {
            //CREATE TRIVIA QUESTIONS OBJECT
            let triviaQuestions : TriviaQuestion[] = []
            for(let i = 0; i < addQuestion.length; i++){
                triviaQuestions.push(new TriviaQuestion(addQuestion[i].question, addQuestion[i].answer, addQuestion[i].difficulty, addQuestion[i].id))
            }

            const wordSearchSettings : WordSearchSettings = new WordSearchSettings(triviaQuestions, allowBackwards, allowDiagonals, enableHints, enableRandomize, maxNumOfChoices, basedGrading, timeLimit)
             //VALIDATE INPUTTED GAME SETTINGS
            const generalGameSettingsValidation = validateGeneralGameSettings(title, basedGrading, allowedAttempts, startDate, endDate)
            const wordSearchSettingsValidation = validateWordSearchSettings(wordSearchSettings)

            if(generalGameSettingsValidation.isValid && wordSearchSettingsValidation.isValid && !titleExists){
                const jsonString: string = JSON.stringify(wordSearchSettings);

                console.log(wordSearchSettings)
                addCustomizedGameData(
                    title,
                    classEntry,
                    basedGrading,
                    allowedAttempts,
                    author,
                    startDate,
                    endDate,
                    jsonString,

                    "WordSearch",). then((id:string) => {
                        addCustomizedGameDataSnippet(id, changeToTitleCase(title), startDate, endDate, "WordSearch")
                        setcustomizedGameLink({title: title, id: id})
                        setShow(true)
                        toast.success("Successfully Created Word Search")
                        setIsLoading(false)
                    })
            }
            else{
                if(titleExists) throw "Title already Exists"

                const errorMessage = generalGameSettingsValidation.message !== ''? generalGameSettingsValidation.message : wordSearchSettingsValidation.message
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
        <title> Create Word Search </title>
        <Navbar/>
        <div className="container_form">
            <div className="dynamic-form">
                <div className="dynamic_form_head">
                    <h1> Word Search Form </h1>
                    <h2> Please fill in the required information </h2>
                </div>

                {/* GAME TITLE INPUT FIELD */}
                <TitleInput title = {title} setTitle  = {setTitle}/>

                {/* CLASS ENTRY SELECT FIELD */}
                <ClassEntrySelect classEntry={classEntry} setClassEntry={setClassEntry} userUID={auth.currentUser?.uid ?? ''}/>

                {/* GRADING SYSTEM INPUT FIELD*/}
                <GradingSystemInput basedGrading = {basedGrading} setBasedGrading = {setBasedGrading}/> 

                {/* BOOLEAN RADIO BUTTON COMPONENTS */}
                <ReverseWord enableReversedWord = {allowBackwards} setEnableReversedWord = {setAllowBackwards} />
                <DiagonalWord enableDiagonalWord = {allowDiagonals} setEnableDiagonalWord = {setAllowDiagonals} />                
                <HintsToggle enableHints = {enableHints} setEnableHints = {setEnableHints} />

                {/* MAXIMUM NUMBER OF CHOICES INPUT FIELD*/}
                <div className="time_form">
                    <label> Maximum number of choices (min: 2) </label>
                    <input type="number" max={20} min={2} value={maxNumOfChoices} onChange={event => setmaxNumOfChoices(Number(event.target.value))} />
                </div>

                {/* TIME PER QUESTION INPUT FIELD*/}
                <div className="time_form">
                    <label> Timer (Minute) </label>
                    <input type="number" min={1} value={timeLimit} onChange={event => setTimeLimit(Number(event.target.value))} />
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
                <SubmitButton isLoading={isLoading} handleSubmit={handleSubmit} name={'Submit Form'} />
                </div>

                {/*POP UP MODAL AFTER SUBMITTING FORM */}
                <div className="submit_form">
                <SubmitPopUp show={show} setShow={setShow} customizedGameLink={customizedGameLink} />
                </div>
            </div>
        </div>

        {/*QUESTION BANK SHOW BUTTON AND MODAL*/}
        <QuestionBankFormModalButton
            showQuestionBankModal = {showQuestionBankModal} setShowQuestionBankModal={setShowQuestionBankModal}
            addQuestions={addQuestion} setAddQuestions={ setAddQuestion}
        />

    </div>
  )
}
