import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import { db, updateCustomizedGameData } from "../../../src/firebase/firebaseConfig";
import { CustomizedGameData } from "../../../src/unityReact";
import { useEffect, useState } from "react";
import { useAuth } from "../../../components/AuthStateContext";
import { WordSearchSettings, validateWordSearchSettings } from "../../../src/WordSearch/WordSearchObject";
import Navbar from "../../../components/Navbar";
import GradingSystemInput from "../../../components/trivia game form/GradingSystemInput";
import TitleInput from "../../../components/trivia game form/TitleInput";
import ReverseWord from "../../../components/word search form/ReverseWord";
import DiagonalWord from "../../../components/word search form/DiagonalWord";
import HintsToggle from "../../../components/trivia game form/HintsToggle";
import StartEndDateSelect from "../../../components/trivia game form/StartEndDateSelect";
import AddQuestionsInput from "../../../components/trivia game form/AddQuestionsInput";
import SubmitButton from "../../../components/SubmitButton";
import { convertToTriviaQuestions } from "../../../src/TriviaGame/TriviaGameObject";
import { titleAlreadyExists, validateGeneralGameSettings } from "../../../src/utils";
import { toast } from "react-toastify";
import RandomizeQuestionsToggle from "../../../components/trivia game form/RandomizeQuestionsToggle";
import Page404 from "../../../components/Page404";
import LoadingPage from "../../../components/LoadingPage";
import QuestionBankFormModalButton from "../../../components/question bank/QuestionBankFormModalButton";
import ClassEntrySelect from "../../../components/trivia game form/ClassEntrySelect";

export default function EditWordSearchPage({customizedGame_id, customizedGameData} : {customizedGame_id : string, customizedGameData : any}) {
  
    //USER AUTHENTICATION TO MAKE SURE THE THE USER IS LOGGED IN WHEN CREATING THE GAME
    const{authUser, loading} = useAuth()
    const[isLoading, setIsLoading] = useState<boolean>(false)

    //GENERAL GAME SETTINGS STATES
    const [title, setTitle] = useState(customizedGameData.title);
    const [classEntry, setClassEntry] = useState<string>(customizedGameData.classEntry)
    const [startDate, setStartDate] = useState<Date>(new Date(customizedGameData.startDate));
    const [endDate, setEndDate] = useState<Date>(new Date(customizedGameData.endDate));
    const [allowedAttempts, setAllowedAttempts] = useState<number>(customizedGameData.allowedAttempts);

    //WORD SEARCH SETTINGS AND QUESTION BANK STATES
    const [wordSearchSettings, setWordSearchSettings] = useState<WordSearchSettings>(new WordSearchSettings([], false, false, false, false, 0, 'based 60', 0));
    const [showQuestionBankModal, setShowQuestionBankModal] = useState<boolean>(false)

    useEffect(() => {
        if(!customizedGameData) return
        const parsedObj = JSON.parse(customizedGameData.gameSettingsJSON)

        //INIT CURRENT WORD SEARCH SETTINGS
        const wordSearchSettings : WordSearchSettings = new WordSearchSettings(
            parsedObj.triviaQuestions, parsedObj.allowBackwards, parsedObj.allowDiagonals, parsedObj.enableHints, parsedObj.randomizeQuestion,
            parsedObj.maxNumOfChoices, parsedObj.basedGrading, parsedObj.timeLimit);
        setWordSearchSettings(wordSearchSettings)

    },[])

    async function handleSubmit()
    {
        setIsLoading(true)
        const titleExists = await titleAlreadyExists(title)

        //CHECK FIRST IF THE CHANGED TITLE IS NOT SIMILAR TO OTHER EXISTING TITLES
        if(title.toLowerCase() !== String(customizedGameData.title).toLowerCase() && titleExists){
            toast.error("Title Already Exsists")
            return
        }

        //VALIDATES THE DATAS INPUTTED IF IT IS VALID, IF IT ISNT IT WOULD RETURN FALSE AND ALSO A MESSAGE FOR THE TOAST NOTIFICATION
        const generalGameSettingsValidation = validateGeneralGameSettings(title, wordSearchSettings.basedGrading, allowedAttempts, startDate, endDate)
        const wordSearchSettingsValidation = validateWordSearchSettings(wordSearchSettings)
        
        //IF EVERYTHING IS VALID THEN IT WOULD UPDATE THE DOCUMENT IN FIREBASE
        if(generalGameSettingsValidation.isValid && wordSearchSettingsValidation.isValid){
            const jsonString: string = JSON.stringify(wordSearchSettings);

            await updateCustomizedGameData(customizedGame_id, title, classEntry, allowedAttempts, startDate, endDate, jsonString).then(() => {toast.success("Changes Saved")})
        }
        else{
            const errorMessage : string = generalGameSettingsValidation.message !== ''? generalGameSettingsValidation.message : wordSearchSettingsValidation.message
            
            toast.error(errorMessage)
            console.log("General Game Setting" + generalGameSettingsValidation.isValid)
            console.log("WordSearch Game Setting" + wordSearchSettingsValidation.isValid)
        }
        setIsLoading(false)
    }

    if(loading){return <LoadingPage/>}
    if(!authUser || authUser.uid !==  customizedGameData.author.id){return <Page404 />} //TO BE CHANGED
    return (
        <div className="forms_div">
        <title> Edit Word Search </title>
        <Navbar/>
        <div className="container_form">
            <div className="dynamic-form">
                <div className="dynamic_form_head">
                    <h1> Edit Word Search Form </h1>
                    <h2> Please fill in the required information </h2>
                </div>

                {/* GAME TITLE INPUT FIELD */}
                <TitleInput title = {title} setTitle  = {setTitle}/>

                {/* ASSIGN CLASS SELECT FIELD */}
                <ClassEntrySelect classEntry = {classEntry} setClassEntry = {setClassEntry} userUID= {authUser.uid ?? ''}/>

                {/* GRADING SYSTEM INPUT FIELD*/}
                <GradingSystemInput 
                    basedGrading = {wordSearchSettings.basedGrading}
                    setBasedGrading = {(basedGrading : string) =>{setWordSearchSettings(prevState => ({...prevState, basedGrading : basedGrading}))}}
                /> 

                {/* BOOLEAN RADIO BUTTON COMPONENTS */}
                <ReverseWord 
                    enableReversedWord = {wordSearchSettings.allowBackwards} 
                    setEnableReversedWord = {(allowBacwards : boolean) => {setWordSearchSettings(prevState => ({...prevState, allowBackwards : allowBacwards}))}}
                />

                <DiagonalWord 
                    enableDiagonalWord = {wordSearchSettings.allowDiagonals} 
                    setEnableDiagonalWord = {(allowDiagonals : boolean) => {setWordSearchSettings(prevState => ({...prevState, allowDiagonals : allowDiagonals}))}}
                />

                <RandomizeQuestionsToggle
                    enableRandomize = {wordSearchSettings.randomizeQuestion}
                    setEnableRandomize = {(randomizeQuestion : boolean) => {setWordSearchSettings(prevState => ({...prevState, randomizeQuestion : randomizeQuestion}))}}
                />

                <HintsToggle 
                    enableHints = {wordSearchSettings.enableHints} 
                    setEnableHints = {(enableHints : boolean) => {setWordSearchSettings(prevState => ({...prevState, enableHints : enableHints}))}}
                />

                {/* MAXIMUM NUMBER OF CHOICES INPUT FIELD*/}
                <div className="time_form">
                    <label> Maximum number of choices </label>
                    <input 
                        type="number" max={20} value={wordSearchSettings.maxNumOfChoices} 
                        onChange={event => setWordSearchSettings(prevState => ({...prevState, maxNumOfChoices : Number(event.target.value)}))}
                    />
                </div>

                {/* TIME LIMIT INPUT FIELD*/}
                <div className="time_form">
                    <label> Timer (Minute) </label>
                    <input 
                        type="number" min={1} value={wordSearchSettings.timeLimit} 
                        onChange={event => setWordSearchSettings(prevState => ({...prevState, timeLimit : Number(event.target.value)}))}
                    />
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
                <AddQuestionsInput 
                    addQuestion= {wordSearchSettings.triviaQuestions} 
                    setAddQuestion = {(addQuestions : any[]) => {setWordSearchSettings(prevState => ({...prevState, triviaQuestions : convertToTriviaQuestions(addQuestions)}))}} 
                />

                {/* SUBMIT BUTTON */}
                <div className="submit_form">
                    <SubmitButton isLoading={isLoading} handleSubmit={handleSubmit} name={'Submit Form'} />
                </div>
                
                {/*QUESTION BANK SHOW BUTTON AND MODAL*/}
                <QuestionBankFormModalButton
                    showQuestionBankModal = {showQuestionBankModal} setShowQuestionBankModal={setShowQuestionBankModal}
                    addQuestions ={wordSearchSettings.triviaQuestions} setAddQuestions = {(addQuestions : any[]) => {setWordSearchSettings(prevState => ({...prevState, triviaQuestions : addQuestions}))}} 
                />
            </div>
        </div>
    </div>
  )
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => { //GET CUSTOMIZED GAME DATA TO USE AS A DEFAULT VALUE FOR INPUT FIELDS
    const customizedGame_id : any = context.params?.customizedGame_id

    const docRef = doc(db, "customizedGame", customizedGame_id);
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data())
  
    if (docSnap.exists()) return { props: { 
      customizedGame_id: customizedGame_id, 
      customizedGameData:JSON.parse(JSON.stringify(new CustomizedGameData(docSnap.data()))) }}
    else return { notFound: true, }
}
