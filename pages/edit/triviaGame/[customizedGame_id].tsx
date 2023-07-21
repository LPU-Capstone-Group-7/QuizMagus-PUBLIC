import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next"
import { useEffect, useState } from "react";
import { useAuth } from "../../../components/AuthStateContext";
import LoadingPage from "../../../components/LoadingPage";
import Navbar from "../../../components/Navbar";
import AddQuestionsInput from "../../../components/trivia game form/AddQuestionsInput";
import GradingSystemInput from "../../../components/trivia game form/GradingSystemInput";
import HintsToggle from "../../../components/trivia game form/HintsToggle";
import RandomizeQuestionsToggle from "../../../components/trivia game form/RandomizeQuestionsToggle";
import StartEndDateSelect from "../../../components/trivia game form/StartEndDateSelect";
import TitleInput from "../../../components/trivia game form/TitleInput";
import { db, updateCustomizedGameData } from "../../../src/firebase/firebaseConfig";
import { CustomizedGameData } from "../../../src/unityReact";
import { TriviaGameSettings, validateTriviaGameSettings, convertToTriviaQuestions } from "../../../src/TriviaGame/TriviaGameObject";
import { toast } from "react-toastify";
import Page404 from "../../../components/Page404";
import { titleAlreadyExists, validateGeneralGameSettings } from "../../../src/utils";
import QuestionBankFormModalButton from "../../../components/question bank/QuestionBankFormModalButton";
import ClassEntrySelect from "../../../components/trivia game form/ClassEntrySelect";
import SubmitButton from "../../../components/SubmitButton";

export default function EditTriviaGamePage({customizedGame_id, customizedGameData} : {customizedGame_id : string, customizedGameData : any}) {

  //GENERAL GAME DATA FIELDS STATES
  const [title, setTitle] = useState<string>(customizedGameData.title);
  const [classEntry, setClassEntry] = useState<string>(customizedGameData.classEntry)
  const [allowedAttempts, setAllowedAttempts] = useState<number>(customizedGameData.allowedAttempts);
  const [startDate, setStartDate] = useState<Date>(new Date(customizedGameData.startDate));
  const [endDate, setEndDate] = useState<Date>(new Date(customizedGameData.endDate));

  //TRIVIA GAME SETTINGS STATE
  const [triviaGameSettings, setTriviaGameSettings] = useState<TriviaGameSettings>(new TriviaGameSettings([], 0, false, false, "based 50"))
  const [showQuestionBankModal, setShowQuestionBankModal] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const{authUser, loading} = useAuth()

  useEffect(() => {
    if(!customizedGameData) return

    const parsedObj = JSON.parse(customizedGameData.gameSettingsJSON)

    const triviaGameSettings : TriviaGameSettings = new TriviaGameSettings(parsedObj.triviaQuestions, parsedObj.timePerQuestions, parsedObj.enableHints, parsedObj.randomizeQuestions, parsedObj.basedGrading)
    setTriviaGameSettings(triviaGameSettings)

  },[])

  useEffect(() => {
    console.log(triviaGameSettings)
  },[triviaGameSettings])

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
    const generalGameSettingsValidation = validateGeneralGameSettings(title, triviaGameSettings.basedGrading, allowedAttempts, startDate, endDate);
    const triviaGameSettingsValidation = validateTriviaGameSettings(triviaGameSettings.triviaQuestions, triviaGameSettings.timePerQuestions, triviaGameSettings.enableHints, triviaGameSettings.randomizeQuestions)
    
    //IF EVERYTHING IS VALID THEN IT WOULD UPDATE THE DOCUMENT IN FIREBASE
    if(generalGameSettingsValidation.isValid && triviaGameSettingsValidation.isValid){
      const jsonString: string = JSON.stringify(triviaGameSettings);

      await updateCustomizedGameData(customizedGame_id, title, classEntry, allowedAttempts, startDate, endDate, jsonString).then(() => {toast.success("Changes Saved")})
    }
    else{
      const errorMessage : string = generalGameSettingsValidation.message !== ''? generalGameSettingsValidation.message : triviaGameSettingsValidation.message
      
      toast.error(errorMessage)
      console.log("General Game Setting" + generalGameSettingsValidation.isValid)
      console.log("Trivia Game Setting" + triviaGameSettingsValidation.isValid)
    }

    setIsSaving(false);
    
  }

  if(loading){return <LoadingPage/>}
  if(!authUser || authUser.uid !==  customizedGameData.author.id){return <Page404 />} //TO BE CHANGED

  return (
    <div className="forms_div">
      <title> Edit Trivia Form </title>
      <Navbar/>
      <div className="container_form">
        <div className="dynamic-form">
          <div className="dynamic_form_head">
              <h1> Edit Trivia Form </h1>
              <h2> Please fill in the required information </h2>
          </div>

          {/* GAME TITLE INPUT FIELD */}
          <TitleInput title = {title} setTitle  = {setTitle}/>

          {/* ASSIGN CLASS SELECT FIELD */}
          <ClassEntrySelect classEntry = {classEntry} setClassEntry = {setClassEntry} userUID= {authUser.uid ?? ''}/>

          {/* GRADING SYSTEM INPUT FIELD*/}
          <GradingSystemInput 
            basedGrading = {triviaGameSettings.basedGrading} 
            setBasedGrading = {(basedGrading : string) => setTriviaGameSettings(prevState => ({...prevState, basedGrading : basedGrading}))}
          /> 

          {/* BOOLEAN RADIO BUTTON COMPONENTS */}
          <HintsToggle 
            enableHints = {triviaGameSettings.enableHints} 
            setEnableHints = {(enableHints : boolean) => setTriviaGameSettings(prevState => ({...prevState, enableHints : enableHints}))}
          />

          <RandomizeQuestionsToggle 
            enableRandomize = {triviaGameSettings.randomizeQuestions}
            setEnableRandomize = {(randomizeQuestion : boolean) => setTriviaGameSettings(prevState => ({...prevState, randomizeQuestions : randomizeQuestion}))}
          />

          {/* TIME PER QUESTION INPUT FIELD*/}
          <div className="time_form">
              <label> Time per Question (Seconds) </label>
              <input 
                type="number" min={1} value={triviaGameSettings.timePerQuestions} 
                onChange={event => setTriviaGameSettings(prevState => ({...prevState, timePerQuestions : Number(event.target.value)}))} 
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
            addQuestion= {triviaGameSettings.triviaQuestions} 
            setAddQuestion = {(addQuestions : any[]) => {setTriviaGameSettings(prevState => ({...prevState, triviaQuestions : convertToTriviaQuestions(addQuestions)}))}} 
          />
          
          <div className="submit_form">
            {/* <button disabled = {isSaving} className="btn-primary submitButton" onClick = {() => {saveCustomizedGameDataHandler()}}>Save</button> */}
            <SubmitButton isLoading = {isSaving} name = "Save" handleSubmit={() => {saveCustomizedGameDataHandler()}}/>
          </div>

          {/*QUESTION BANK SHOW BUTTON AND MODAL*/}
          <QuestionBankFormModalButton
            showQuestionBankModal = {showQuestionBankModal} setShowQuestionBankModal={setShowQuestionBankModal}
            addQuestions ={triviaGameSettings.triviaQuestions} setAddQuestions = {(addQuestions : any[]) => {setTriviaGameSettings(prevState => ({...prevState, triviaQuestions : addQuestions}))}} 
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

