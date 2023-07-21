import { collection, doc, getDoc, onSnapshot, query } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react"
import StudentResult from "../../components/customized game/StudentResult";
import ExcelExportButton from "../../components/data visualization/ExcelExportButton";
import PassPercentagePie from "../../components/data visualization/PassPercentagePie";
import TriviaQuestionAverageTimeBar from "../../components/data visualization/trivia game/TriviaQuestionAverageTimeBar";
import TriviaQuestionResultsBar from "../../components/data visualization/trivia game/TriviaQuestionResultsBar";
import Navbar from "../../components/Navbar";
import Page404 from "../../components/Page404";
import { getStudentResultsOutcome, getStudentTotalGrades, getTriviaQuestionsAverageTimeData } from "../../src/dataVisualization_utils";
import { db } from "../../src/firebase/firebaseConfig";
import { TriviaQuestion } from "../../src/TriviaGame/TriviaGameObject";
import { customizedGameResultCol } from "../../src/constants";

export default function CustomizedGameResultPage({triviaGameResult_id, triviaQuestions, customizedGameTitle} : {triviaGameResult_id : string, triviaQuestions : TriviaQuestion[], customizedGameTitle : string}) {

    const [studentResults, setStudentResults] = useState<any[]>([]);
    useEffect(() =>{
        if(!triviaGameResult_id) return 

        //GET STUDENT RESULTS FROM FIREBASE USING REALTIME LISTENER
        const studentResultsQuery = query(collection(db, customizedGameResultCol, triviaGameResult_id.toString(), "studentResults"))
        const unsubscribe = onSnapshot(studentResultsQuery, (querySnapshot) => {
            const studentResultsDocuments : any[] = [];
            querySnapshot.forEach((doc) => {
                studentResultsDocuments.push({id : doc.id, ...doc.data()});
            });
            setStudentResults(studentResultsDocuments)
        });

        return () => unsubscribe();
    },[])
    
    if(!triviaGameResult_id) return (<Page404/>)

    return (<>
        <title> Quiz Magus - Summary </title>
        <Navbar/>
        <div className = "dataVisualization_header">
            <h1>{customizedGameTitle} Summary</h1>
        </div>
        <div className="datavisualization_container">
            <div className="visualization_firstcolumn">
                <div className="first_section">
                    <LabeledNumberBox label = {"Assessment Takers"} amount = {studentResults.length}/>
                    <LabeledNumberBox label = {"Passed"} amount = {getStudentResultsOutcome(studentResults).passers}/>
                    <LabeledNumberBox label = {"Failed"} amount = {getStudentResultsOutcome(studentResults).failures}/>
                </div>
                <div className="second_section flex-column">
                    <ExcelExportButton studentResults={studentResults} title = {customizedGameTitle}/>
                    <StudentResult studentResult = {studentResults} triviaGameResult_id = {triviaGameResult_id}/>
                </div>
            </div>
            <div className="visualization_secondcolumn">
                <div className = "dataVisualization_collectiveData">
                    <PassPercentagePie studentGrades={getStudentTotalGrades(studentResults)}/>
                    <TriviaQuestionResultsBar studentResults = {studentResults} triviaQuestions = {triviaQuestions}/>
                    <TriviaQuestionAverageTimeBar questionsAverageTime = {getTriviaQuestionsAverageTimeData(studentResults, triviaQuestions)}/>
                    
                </div>
            </div>
        </div>
    </>)
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => { //GET CUSTOMIZED GAME ID AND DATA FROM FIREBASE SERVER BEFORE ACTUALLY RENDERING THE PAGE
    const triviaGameResult_id : any = context.params?.triviaGameResult_id
    let triviaQuestions : any = []

    //GET CUSTOMIZED GAME QUESTIONS
    if(triviaGameResult_id){
        
        const docRef = doc(db, "customizedGame", triviaGameResult_id)
        const docSnap = await getDoc(docRef)

        if(docSnap.exists()){
            const gameSettings = JSON.parse(docSnap.data().gameSettingsJSON)
            triviaQuestions = gameSettings.triviaQuestions
        }

        return {props: {
            triviaGameResult_id : triviaGameResult_id.toString(),
            triviaQuestions : triviaQuestions ?? [],
            customizedGameTitle : docSnap.data()?.title ?? ''
        }}
    }
    else return {notFound: true}
  }
 

  //LABELED NUMBER BOX FOR DATA VISUALIZATION PAGE
  function LabeledNumberBox({label, amount} : {label : string, amount : number}){

    return(
        <div className = "dataVisualization_chartBackground dataVisualization_labeledNumberBox">
            <p className = "text-label h3-text font-semibold">{label}</p>
            <p className = "text-amount font-bold">{amount}</p>
        </div>
    )
  }