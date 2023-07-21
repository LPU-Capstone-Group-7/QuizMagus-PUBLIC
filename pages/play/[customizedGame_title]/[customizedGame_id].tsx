import { doc, getDoc, increment, setDoc} from 'firebase/firestore'
import { GetServerSidePropsContext } from 'next'
import { useCallback, useEffect, useState } from 'react'
import { db } from '../../../src/firebase/firebaseConfig'
import Navbar from '../../../components/Navbar'
import dynamic from "next/dynamic";
import {useUnityContext } from 'react-unity-webgl'
import { CustomizedGameData, StudentResult, UnityReactGame } from '../../../src/unityReact'
import { getPlayingTime, TriviaGameResults } from '../../../src/TriviaGame/TriviaGameObject'
import PlayerModal from '../../../components/customized game/PlayerModal'
import GameExpired from '../../../components/customized game/GameExpired'
import GameUnavailable from '../../../components/customized game/GameUnavailable'
import { customizedGameResultCol } from '../../../src/constants'
import { toast } from 'react-toastify'
import TopLeaderboards from '../../../components/customized game/TopLeaderboards'
import Leaderboards from '../../../components/customized game/Leaderboards'
import { collection, onSnapshot, query } from "firebase/firestore";
import { sortStudentResults } from '../../../src/dataVisualization_utils'
import { Button } from 'react-bootstrap'
import { FullScreenIcon } from '../../../components/svg icons/SvgIcons'

const Unity = dynamic(() =>
  import('react-unity-webgl').then((mod) => mod.Unity),{
    ssr: false,
  }
)

export default function CustomizedGamePage({customizedGame_id, customizedGameData}: {customizedGame_id : string, customizedGameData : CustomizedGameData}) {

  const [sendDataTrigger, setSendDataTrigger] = useState<boolean>()
  const [initialStudentResult, setInitialStudentResult] = useState<StudentResult>()
  const [showPlayerModal, setShowPlayerModal] = useState<boolean>(false)

  const [studentResults, setStudentResults] = useState<any[]>([]);

  const {unityProvider, sendMessage, addEventListener, removeEventListener, unload, requestFullscreen} = useUnityContext({ //CREATES THE UNITY USE CONTEXT
    loaderUrl: "/Build/QuizMagus.loader.js",
    dataUrl: "/Build/QuizMagus.data",
    frameworkUrl: "/Build/QuizMagus.framework.js",
    codeUrl: "/Build/QuizMagus.wasm",
  });

  const handleSendReactGame = useCallback((message : string) => {   //RECIEVES CALLBACK WHEN THE SENDREACTGAME FUNC IS CALLED INN UNITY
    setSendDataTrigger(currentState => !currentState)
    console.log(message)
  }, []);

  const handleGameResultMessage = useCallback((message : string) =>{ //SENDS GAME RESULT TO FIREBASE WHEN THIS IS CALLED
    if(!initialStudentResult) return
    //CONVERT JSON FILE INTO A CUSTOM OBJECT CLASS
    const triviaGameResults : TriviaGameResults = JSON.parse(message)

    //CREATE A REFERENCE FOR THE TRIVIA GAME RESUlTS
    saveTriviaGameResult(triviaGameResults, initialStudentResult)
    
  },[initialStudentResult]);

  useEffect(() =>{
    if(!customizedGame_id) return 

    //GET STUDENT RESULTS FROM FIREBASE USING REALTIME LISTENER
    const studentResultsQuery = query(collection(db, customizedGameResultCol, customizedGame_id.toString(), "studentResults"))
    const unsubscribe = onSnapshot(studentResultsQuery, (querySnapshot) => {
        const studentResultsDocuments : any[] = [];
        querySnapshot.forEach((doc) => {
            studentResultsDocuments.push({id : doc.id, ...doc.data()});
        });
        setStudentResults(studentResultsDocuments.sort((a,b) => b.totalGrade - a.totalGrade))
    });

    return () => unsubscribe();
},[])

  useEffect(() => {   //SENDS DATA TO UNITY AND SET INITIAL STUDENT RESULT SNIPPET IN FIREBASE
    if(!initialStudentResult) return
    console.log(customizedGameData)
    //SENDS THE UNIQUE GAME SETTINGS TO UNITY
    const unityReactGameJSON = JSON.stringify(new UnityReactGame(customizedGameData.gameType, customizedGameData.gameSettingsJSON, customizedGameData.allowedAttempts))
    sendMessage("UnityReactManager", "StartGame", unityReactGameJSON)

    //SET INITIAL STUDENT RESULT DATA IN FIREBASE AND UPDATE THE NUMBER OF ATTEMPTS AND CURRENT DATE PLAYED
    setStudentResultDoc(initialStudentResult)
  },[sendDataTrigger])

  useEffect(() => { //THIS IS DONE TO TELL REACT THAT A FUNCTION WAS CALLED IN UNITY AND THEN CALLS THE HANDLE REACT GAME MESSAGE CALLBACK
    addEventListener("SendReactGame", handleSendReactGame);
    addEventListener("SendTriviaGameResult", handleGameResultMessage);
    return () => {
      removeEventListener("SendReactGame", handleSendReactGame);
      removeEventListener("SendTriviaGameResult", handleGameResultMessage);
    };
  }, [addEventListener, removeEventListener, handleSendReactGame, handleGameResultMessage]);

  async function setStudentResultDoc(studentResult : StudentResult){ //SETS STUDENT RESULTS SNIPPETS EVERYTIME THIS IS CALLED

    try{
      const studentResultRef = doc(db, customizedGameResultCol, customizedGame_id, "studentResults", studentResult.name)
      await setDoc(studentResultRef, {...studentResult})
    }
    catch(error){
      console.log(error)
    }

  }

  async function saveTriviaGameResult(triviaGameResults : TriviaGameResults, currentStudentResult : StudentResult){

    //FIX TRIVIA DATAS ROUNDING VALUES
    const roundedTriviaDatas = triviaGameResults.triviaDatas.map(data => ({
      ...data,
      timeToAnswer: Number(data.timeToAnswer.toFixed(2)), // round to 2 decimal places
    }));

    //CREATE UPDATED STUDENT RESULT DATA
    const updatedStudentResult : StudentResult = {
      name : currentStudentResult.name,
      triviaDatas : roundedTriviaDatas,
      numberOfAttempts : currentStudentResult.numberOfAttempts,
      datePlayed : currentStudentResult.datePlayed,
      playingTime : getPlayingTime(triviaGameResults.triviaDatas),
      totalGrade : Math.round(triviaGameResults.totalGrade)
    }

    //NEW SCORE IS HIGHER THAN OLD SCORE
    if(updatedStudentResult.totalGrade >= currentStudentResult.totalGrade){
      setStudentResultDoc(updatedStudentResult)
      toast.success("New Highscore!!!")
    }
  }

  const dateToday = new Date();
  const startDate = new Date(customizedGameData.startDate)
  const endDate = new Date(customizedGameData.endDate)

  if ( startDate > dateToday){
    return (
      <GameUnavailable/>
    );
  } else if ( endDate < dateToday){
    return (
      <GameExpired />
    );
  } else {
    return (<>
      <title> Quiz Magus Customized Game </title>
      <Navbar onClickEvent = {unload}/>
      <div className="game-page">
        <div className="game_header">
        <div className="game_headerdetails">
            <h1> {customizedGameData.title}</h1>
          </div>
          <div className="game_headeruser">
          { initialStudentResult ? 
          (<h1>Welcome to Quiz Magus, {initialStudentResult.name}!</h1>) : null }
          </div>
        </div>
            <PlayerModal 
                setInitialStudentResult={setInitialStudentResult} resultCollectionName={customizedGameResultCol} 
                showPlayerModal = {showPlayerModal} customizedGame_id={customizedGame_id} 
                allowedAttempts={customizedGameData.allowedAttempts} setShowPlayerModal = {setShowPlayerModal} 
                gameType={customizedGameData.gameType} classEntry= {customizedGameData.classEntry ?? ""} authorID = {customizedGameData.author.id}
            />
          {!showPlayerModal &&
          <>
            <div className= "UnityContainer">
              <Unity
                unityProvider= {unityProvider}
                className = "UnityStyles"
              />
            </div>
            <div className="fullscreen_div">
              <Button id="fullscreen_button" onClick = {() => {requestFullscreen(true)}}>
                <p> Enter Full Screen </p>
                <div className="fullscreen_icon">
                  <FullScreenIcon/>
                </div>
              </Button>
            </div>
          </>
        }

        {studentResults.length > 0 && 
        <>
        <div className="leaderboards_section">
          <h1> Leaderboards </h1>
          <TopLeaderboards studentResults={studentResults} />

          {studentResults.length >= 4 && 
          <Leaderboards studentResults = {studentResults.slice(3)}/>}
        </div>
        </>}
      </div>
    </>)
  }
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => { //GET CUSTOMIZED GAME ID AND DATA FROM FIREBASE SERVER BEFORE ACTUALLY RENDERING THE PAGE
  const customizedGame_id : any = context.params?.customizedGame_id
  const customizedGame_title : any = context.params?.customizedGame_title

  if(customizedGame_title === undefined || customizedGame_id === undefined){
    return {notFound: true}
  }
  const docRef = doc(db, "customizedGame", customizedGame_id);
  const docSnap = await getDoc(docRef);
  console.log(docSnap.data())

  if (docSnap.exists() && docSnap.data().title.toLowerCase() == customizedGame_title.toLowerCase()) return { props: { 
    customizedGame_id: customizedGame_id, 
    customizedGameData:JSON.parse(JSON.stringify(new CustomizedGameData(docSnap.data()))) }}
  else return { notFound: true, }
}

