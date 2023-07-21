import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '../../src/firebase/firebaseConfig';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useState } from 'react';
import { StudentResult } from '../../src/unityReact';
import { changeToTitleCase } from '../../src/utils';
import TutorialComponent from '../tutorial/TutorialComponent';
import ClassPlayerModal from './ClassPlayerModal';

interface PlayerModalProps{
  setInitialStudentResult : any, 
  resultCollectionName : string, 
  customizedGame_id : string, 
  allowedAttempts : number, 
  showPlayerModal : any, 
  setShowPlayerModal : any,
  gameType : any,
  classEntry : string
  authorID : string
}

export default function PlayerModal({setInitialStudentResult, resultCollectionName, customizedGame_id, allowedAttempts, showPlayerModal, setShowPlayerModal, gameType, classEntry, authorID} : PlayerModalProps) {
  const [showTutorialModal, setShowTutorialModal] = useState(false);

  //PLAYERMODAL
  const handleClose = () => {
    setShowPlayerModal(false);
    setShowTutorialModal(false);
  };

  useEffect(() => {
    setShowPlayerModal(true)
    //setShowTutorialModal(true);
  },[])

  async function submitNameHandler(event : any, input : string){
    event.preventDefault();

    //CHECKS IF NAME EXIST IN FIREBASE STUDENT RESULTS SNIPPETS COLLECTION
    if(input){
      const studentResultRef = doc(db, resultCollectionName, customizedGame_id, "studentResults", input.toLowerCase())
      const docSnap = await getDoc(studentResultRef)

      const initialStudentResult : StudentResult = {
        name : input.toLowerCase(),
        triviaDatas : [],
        numberOfAttempts : 1,
        totalGrade : 0,
        playingTime : 0,
        datePlayed : new Date()
      }

      //IF DOCUMENT ALREADY EXIST IT MEANS THAT THE PLAYER HAD PLAYED THE GAME PREVIOUSLY, CHECK IF HE/SHE IS STILL WITHIN THE ALLOWABLE ATTEMPTS
      if(docSnap.exists()){
        if(docSnap.data().numberOfAttempts <= allowedAttempts) {

          //CHANGE INITIAL STUDENT RESULT VALUES TO DOC'S DATA AND ONLY UPDATE THE DATE AND NUMBER OF ATTEMPTS
          initialStudentResult.name = docSnap.id
          initialStudentResult.triviaDatas = docSnap.data().triviaDatas
          initialStudentResult.numberOfAttempts = docSnap.data().numberOfAttempts + 1
          initialStudentResult.totalGrade = docSnap.data().totalGrade
          initialStudentResult.playingTime = docSnap.data().playingTime

          createInitialStudentResultData(initialStudentResult)
          toast.success("Welcome back "+ changeToTitleCase(docSnap.id));

		  //CHECKS IF THE USER IS A NEW PLAYER OR NOT
		  docSnap.data().numberOfAttempts === 0? setShowTutorialModal(true) : setShowPlayerModal(false)
        }
        else{ toast.error("Already reached maximum attempts")}
      }
      else{
        createInitialStudentResultData(initialStudentResult)
        toast.success("You look new, ready to play?")
        setShowTutorialModal(true);
      }
    }
  }

// CREATE A PLACEHOLDER STUDENT RESULT VALUES INCASE PLAYER WAS NOT ABLE TO FINISH THE GAME
const createInitialStudentResultData = (placeHolderStudentResult : StudentResult) => setInitialStudentResult(placeHolderStudentResult)

  return (
  <>
    {classEntry == ""? 
    	<DefaultPlayerModal showPlayerModal = {showPlayerModal} handleClose = {handleClose} submitNameHandler = {submitNameHandler}/> :
        <ClassPlayerModal showPlayerModal = {showPlayerModal} handleClose = {handleClose} submitNameHandler = {submitNameHandler} classEntry = {classEntry} authorID = {authorID}/>
    }

      {showTutorialModal && (
        <Modal id="tutorialModal" className="modal" show={showTutorialModal} onHide={handleClose} backdrop="static" keyboard={false} centered>
          <Modal.Body>
            <div className="tutorial_modal">
              <TutorialComponent gameType={gameType}/>
            <button id="tutorial_close" onClick={handleClose}>Close</button>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </>
  )
}

export function DefaultPlayerModal({showPlayerModal, handleClose, submitNameHandler} : any){

  const [name, setName] = useState<string>()

  return(
    <Modal className="modal" show={showPlayerModal} onHide={handleClose} backdrop="static" keyboard={false} centered = {true}>
      <Modal.Body>
        <form className = "playermodal" onSubmit={(event) => {submitNameHandler(event, name)}}>
          <h1>Enter your name</h1>
          <label><input type = "text" name = "name" value = {name} onChange={(event) => setName(event.target.value)}/></label>
          <div className="submit">
            <button id="modal_submit">Submit</button>
          </div>
        </form> 
      </Modal.Body>
    </Modal>
  )
}