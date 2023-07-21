import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next"
import { useEffect, useState } from "react";
import { useAuth } from "../../../components/AuthStateContext";
import LoadingPage from "../../../components/LoadingPage";
import Navbar from "../../../components/Navbar";
import AddQuestionsInput from "../../../components/trivia game form/AddQuestionsInput";
import GradingSystemInput from "../../../components/trivia game form/GradingSystemInput";
import StartEndDateSelect from "../../../components/trivia game form/StartEndDateSelect";
import TitleInput from "../../../components/trivia game form/TitleInput";
import { db, updateCustomizedGameData } from "../../../src/firebase/firebaseConfig";
import { CustomizedGameData } from "../../../src/unityReact";
import { convertToTriviaQuestions } from "../../../src/TriviaGame/TriviaGameObject";
import { toast } from "react-toastify";
import Page404 from "../../../components/Page404";
import { titleAlreadyExists, validateGeneralGameSettings } from "../../../src/utils";
import QuestionBankFormModalButton from "../../../components/question bank/QuestionBankFormModalButton";
import { CrossWordSettings, validateCrosswordSettings } from '../../../src/CrossWord/CrossWordObject';
import ShowCorrectAnswer from "../../../components/crossword form/ShowCorrectAnswer";
import NumOfLettersToShow from "../../../components/crossword form/NumOfLettersToShow";
import TimeLimit from "../../../components/crossword form/TimeLimit";
import RandomizeQuestionsToggle from "../../../components/trivia game form/RandomizeQuestionsToggle";
import ClassEntrySelect from "../../../components/trivia game form/ClassEntrySelect";
import SubmitButton from "../../../components/SubmitButton";


/**
 * 
 * ADD MISSING COMPONENT FIELD
 * SUBMIT CHANGES
 */
export default function EditCrossWordPage({customizedGame_id, customizedGameData} : {customizedGame_id : string, customizedGameData : any}) {

  //GENERAL GAME DATA FIELDS STATES
  const [title, setTitle] = useState<string>(customizedGameData.title);
  const [classEntry, setClassEntry] = useState<string>(customizedGameData.classEntry)
  const [allowedAttempts, setAllowedAttempts] = useState<number>(customizedGameData.allowedAttempts);
  const [startDate, setStartDate] = useState<Date>(new Date(customizedGameData.startDate));
  const [endDate, setEndDate] = useState<Date>(new Date(customizedGameData.endDate));

  //CROSSWORD GAME SETTINGS STATE
  const [crossWordSettings, setCrossWordSettings] = useState<CrossWordSettings>(new CrossWordSettings([], false, "based 50", 0, 0, false))
  const [showQuestionBankModal, setShowQuestionBankModal] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const{authUser, loading} = useAuth()

  useEffect(() => {
    if(!customizedGameData) return

    const parsedObj = JSON.parse(customizedGameData.gameSettingsJSON)

    const crossWordSettings : CrossWordSettings = new CrossWordSettings(parsedObj.triviaQuestions, parsedObj.randomizeQuestions, parsedObj.basedGrading, parsedObj.timeLimit, parsedObj.numOfLettersToShow, parsedObj.showCorrectAnswer)
    setCrossWordSettings(crossWordSettings)

  },[])

  useEffect(() => {
    console.log(crossWordSettings)
  },[crossWordSettings])

  //HANDLES THE SAVING OR UPDATING OF CUSTOMIZED GAME DATA
  async function saveCustomizedGameDataHandler(){

    const titleExists = await titleAlreadyExists(title)
    setIsSaving(true)

    //CHECK FIRST IF THE CHANGED TITLE IS NOT SIMILAR TO OTHER EXISTING TITLES
    if(title.toLowerCase() !== String(customizedGameData.title).toLowerCase() && titleExists){
      toast.error("Title Already Exsists")
      return
    }

    //VALIDATES THE DATAS INPUTTED IF IT IS VALID, IF IT ISNT IT WOULD RETURN FALSE AND ALSO A MESSAGE FOR THE TOAST NOTIFICATION
    const generalGameSettingsValidation = validateGeneralGameSettings(title, crossWordSettings.basedGrading, allowedAttempts, startDate, endDate);
    const crossWordGameSettingsValidation = validateCrosswordSettings(crossWordSettings)
    
    //IF EVERYTHING IS VALID THEN IT WOULD UPDATE THE DOCUMENT IN FIREBASE
    if(generalGameSettingsValidation.isValid && crossWordGameSettingsValidation.isValid){
      const jsonString: string = JSON.stringify(crossWordSettings);

      await updateCustomizedGameData(customizedGame_id, title, classEntry, allowedAttempts, startDate, endDate, jsonString).then(() => {toast.success("Changes Saved")})
    }
    else{
      const errorMessage : string = generalGameSettingsValidation.message !== ''? generalGameSettingsValidation.message : crossWordGameSettingsValidation.message
      
      toast.error(errorMessage)
      console.log("General Game Setting" + generalGameSettingsValidation.isValid)
      console.log("CrossWord Game Setting" + crossWordGameSettingsValidation.isValid)
    }

    setIsSaving(false)
    
  }

  if(loading){return <LoadingPage/>}
  if(!authUser || authUser.uid !==  customizedGameData.author.id){return <Page404 />} //TO BE CHANGED

  return (
    <div className="forms_div">
      <title> Edit Crossword </title>
      <Navbar/>
      <div className="container_form">
        <div className="dynamic-form">
          <div className="dynamic_form_head">
              <h1> Edit Crossword Form </h1>
              <h2> Please fill in the required information </h2>
          </div>

          {/* GAME TITLE INPUT FIELD */}
          <TitleInput title = {title} setTitle  = {setTitle}/>

          {/* ASSIGN CLASS SELECT FIELD */}
          <ClassEntrySelect classEntry = {classEntry} setClassEntry = {setClassEntry} userUID= {authUser.uid ?? ''}/>

          {/* GRADING SYSTEM INPUT FIELD*/}
          <GradingSystemInput 
            basedGrading = {crossWordSettings.basedGrading} 
            setBasedGrading = {(basedGrading : string) => setCrossWordSettings(prevState => ({...prevState, basedGrading : basedGrading}))}
          /> 

          {/* RANDOMIZE QUESTION TOGGLE COMPONENT */}
          <RandomizeQuestionsToggle
            enableRandomize = {crossWordSettings.randomizeQuestions}
            setEnableRandomize = {(enableRandomize : boolean) => setCrossWordSettings(prevState => ({...prevState, randomizeQuestions : enableRandomize}))}
          />

          {/* BOOLEAN RADIO BUTTON COMPONENTS */}
          <ShowCorrectAnswer 
            showCorrectAnswer = {crossWordSettings.showCorrectAnswer} 
            setShowCorrectAnswer = {(showCorrectAnswer :boolean) => setCrossWordSettings(prevState => ({...prevState, showCorrectAnswer : showCorrectAnswer}))}
          />

          {/* NUMBER OF LETTERS TO SHOW*/}
          <NumOfLettersToShow
            numOfLettersToShow={crossWordSettings.numOfLettersToShow}
            setNumOfLettersToShow={(numOfLettersToShow : number) => setCrossWordSettings(prevState => ({...prevState, numOfLettersToShow : numOfLettersToShow}))}
          />

          {/* TIME LIMIT FOR WHOLE GAME INPUT FIELD*/}
          <TimeLimit
            timeLimit={ crossWordSettings.timeLimit}
            setTimeLimit={(timeLimit : number) => setCrossWordSettings(prevState => ({...prevState, timeLimit : timeLimit}))}
          />

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
            addQuestion= {crossWordSettings.triviaQuestions} 
            setAddQuestion = {(addQuestions : any[]) => {setCrossWordSettings(prevState => ({...prevState, triviaQuestions : convertToTriviaQuestions(addQuestions)}))}} 
          />
          
          <div className="submit_form">
            {/* <button className="btn-primary submitButton" onClick = {() => {saveCustomizedGameDataHandler()}}>Save</button> */}
            <SubmitButton isLoading = {isSaving} name="Save" handleSubmit={() => {saveCustomizedGameDataHandler()}}/>
          </div>

          {/*QUESTION BANK SHOW BUTTON AND MODAL*/}
          <QuestionBankFormModalButton
            showQuestionBankModal = {showQuestionBankModal} setShowQuestionBankModal={setShowQuestionBankModal}
            addQuestions ={crossWordSettings.triviaQuestions} setAddQuestions = {(addQuestions : any[]) => {setCrossWordSettings(prevState => ({...prevState, triviaQuestions : addQuestions}))}} 
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
