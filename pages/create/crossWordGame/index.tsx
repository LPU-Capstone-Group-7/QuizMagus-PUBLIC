import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../components/AuthStateContext'
import Navbar from '../../../components/Navbar'
import { v4 as uuidv4 } from 'uuid';
import SubmitPopUp from '../../../components/customized game/SubmitPopUp';
import TitleInput from '../../../components/trivia game form/TitleInput';
import GradingSystemInput from '../../../components/trivia game form/GradingSystemInput';
import StartEndDateSelect from '../../../components/trivia game form/StartEndDateSelect';
import AddQuestionsInput from '../../../components/trivia game form/AddQuestionsInput';
import SubmitButton from '../../../components/SubmitButton';
import QuestionBankFormModalButton from '../../../components/question bank/QuestionBankFormModalButton';
import LoadingPage from '../../../components/LoadingPage';
import router from 'next/router';
import { changeToTitleCase, setCurrentUserAsAuthor, titleAlreadyExists, validateGeneralGameSettings } from '../../../src/utils';
import { addCustomizedGameData, addCustomizedGameDataSnippet, auth } from '../../../src/firebase/firebaseConfig';
import { toast } from 'react-toastify';
import { TriviaQuestion } from '../../../src/TriviaGame/TriviaGameObject';
import { CrossWordSettings, validateCrosswordSettings } from '../../../src/CrossWord/CrossWordObject';
import ShowCorrectAnswer from '../../../components/crossword form/ShowCorrectAnswer';
import NumOfLettersToShow from '../../../components/crossword form/NumOfLettersToShow';
import TimeLimit from '../../../components/crossword form/TimeLimit';
import RandomizeQuestionsToggle from '../../../components/trivia game form/RandomizeQuestionsToggle';
import ClassEntrySelect from '../../../components/trivia game form/ClassEntrySelect';

export default function CrossWordForm() {
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

    // CROSSWORD UNIQUE FIELDS
    const [numOfLettersToShow, setNumOfLettersToShow] = useState<number>(0); // MINIMUM TIME LIMIT
    const [showCorrectAnswer, setShowCorrectAnswer] = useState<boolean>(false)

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

            const crossWordSettings : CrossWordSettings = new CrossWordSettings(triviaQuestions, enableRandomize, basedGrading, timeLimit, numOfLettersToShow, showCorrectAnswer)
             //VALIDATE INPUTTED GAME SETTINGS
            const generalGameSettingsValidation = validateGeneralGameSettings(title, basedGrading, allowedAttempts, startDate, endDate)
            const crossWordSettingsValidation = validateCrosswordSettings(crossWordSettings)

            if(generalGameSettingsValidation.isValid && crossWordSettingsValidation.isValid && !titleExists){
                const jsonString: string = JSON.stringify(crossWordSettings);

                console.log(crossWordSettings)
                addCustomizedGameData(
                    title,
                    classEntry,
                    basedGrading,
                    allowedAttempts,
                    author,
                    startDate,
                    endDate,
                    jsonString,

                    "CrossWord",). then((id:string) => {
                        addCustomizedGameDataSnippet(id, changeToTitleCase(title), startDate, endDate, "CrossWord")
                        setcustomizedGameLink({title: title, id: id})
                        setShow(true)
                        toast.success("Successfully Created CrossWord")
                        setIsLoading(false)
                    })
            }
            else{
                if(titleExists) throw "Title already Exists"

                const errorMessage = generalGameSettingsValidation.message !== ''? generalGameSettingsValidation.message : crossWordSettingsValidation.message
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
        <title> Create Crossword </title>
        <Navbar/>
        <div className="container_form">
            <div className="dynamic-form">
                <div className="dynamic_form_head">
                    <h1> Crossword Form </h1>
                    <h2> Please fill in the required information </h2>
                </div>

                {/* GAME TITLE INPUT FIELD */}
                <TitleInput title = {title} setTitle  = {setTitle}/>

                {/* CLASS ENTRY SELECT FIELD */}
                <ClassEntrySelect classEntry={classEntry} setClassEntry={setClassEntry} userUID={auth.currentUser?.uid ?? ''}/>

                {/* GRADING SYSTEM INPUT FIELD*/}
                <GradingSystemInput basedGrading = {basedGrading} setBasedGrading = {setBasedGrading}/> 

                <RandomizeQuestionsToggle enableRandomize = {enableRandomize} setEnableRandomize = {setEnableRandomize}/>

                 {/* BOOLEAN RADIO BUTTON COMPONENTS */}
                <ShowCorrectAnswer showCorrectAnswer = {showCorrectAnswer} setShowCorrectAnswer = {setShowCorrectAnswer}/>

                {/* NUMBER OF LETTERS TO SHOW*/}
                <NumOfLettersToShow numOfLettersToShow={numOfLettersToShow} setNumOfLettersToShow={setNumOfLettersToShow}/>

                {/* TIME PER QUESTION INPUT FIELD*/}
                <TimeLimit timeLimit={timeLimit} setTimeLimit={setTimeLimit}/>

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