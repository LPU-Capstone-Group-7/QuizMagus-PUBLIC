import React, { useState } from 'react'
import { dateToStringFormat } from '../../src/utils';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../src/firebase/firebaseConfig';
import { CorrectIcon, ErrorIcon, SmallCorrectIcon, SmallErrorIcon, TimeIcon } from '../svg icons/SvgIcons';
import { getStudentAverageTimePerQuestions, getStudentTriviaDatasResults } from '../../src/dataVisualization_utils';
import { customizedGameResultCol, passingGrade } from '../../src/constants';
import IndividualPieChart from '../data visualization/IndividualPieChart';

export default function StudentResult({studentResult, triviaGameResult_id} : {studentResult: any[], triviaGameResult_id : string}) {
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false); // MODAL FOR DELETE DOC
  const [selectedItem, setSelectedItem] = useState<any>({id : '', triviaDatas : []})

  const [showViewModal, setShowViewModal] = useState<boolean>(false);
  const onDelete = async(id :string, studentName : string) =>{
    try {
      setShowConfirmationModal(false);
      toast.success('Documents successfully deleted!');
      await deleteDoc(doc(db, customizedGameResultCol, id, "studentResults", studentName));
    } catch (e) {
      setShowConfirmationModal(false);
      console.error('Error deleting documents: ', e);
    }
};

  return (
    <div className="student_result_table">
    <table className='table-zebra'>
      <thead>
        <tr>
          <th> Name </th>
          <th> High Score</th>
          <th> No. of Attempts</th>
          <th> Date Completed </th>
        </tr>
      </thead>

      <tbody>
        {studentResult && studentResult.length > 0 && studentResult.map((result, key) => {
          return (
              <tr key={key}>
                <th>{result.id} </th>  
                <th>{result.totalGrade} </th>  
                <th>{result.numberOfAttempts}</th>
                <th>{dateToStringFormat(result.datePlayed.toDate())}</th>
                <td>
                  <div className="dropdown">
                      <button className="kebab_dashboard">
                          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                          <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                          </svg>
                      </button>

                      <div className="dropdown-content">
                          <button onClick={() => {setSelectedItem(result); setShowViewModal(true)}}>View</button>
                          <button onClick={() => {setSelectedItem(result), setShowConfirmationModal(true)}}>Delete</button>
                      </div>

                  </div>
              </td>
              </tr>
          )})}
        </tbody>
      </table>

      {/* DELETE MODAL */}
      <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)} centered>
        <div className="deletedoc_modal">
        <Modal.Header closeButton>
        <Modal.Title>Delete Confirmation</Modal.Title></Modal.Header>
        <Modal.Body>Are you sure you want to delete &quot;{selectedItem.id ? `${selectedItem.id}` : ''}&quot;?</Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowConfirmationModal(false)}>Cancel</Button>
        <Button variant="primary" onClick={() => onDelete(triviaGameResult_id, selectedItem.id)}>Delete</Button>
        </Modal.Footer></div></Modal>

        {/* VIEW MODAL */}
        <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
          <div className="view_modal">
            <Modal.Header closeButton>
              <Modal.Title className = "capitalize"> {selectedItem.id ?? ''}&apos;s Data </Modal.Title>
            </Modal.Header>
            <Modal.Body className = "flex-column">
              <h1 className = "font-bold h2-text">Assessment Summary</h1>
              
              <div className="individual_summary">
                <div className="individual_summary_container">
                  <div className="individual_summary_text">
                    <p>Played: {selectedItem.datePlayed && dateToStringFormat(selectedItem.datePlayed.toDate())}</p>
                    <p>Attempts: {selectedItem.numberOfAttempts}</p>
                    <p>Result: {selectedItem.totalGrade >= passingGrade? "PASSED" : "FAILED"}</p>
                  </div>
                  <div className="individual_summary_graph">
                  <IndividualPieChart totalGrade = {selectedItem.totalGrade}/>
                  </div>
                </div>
              </div>

              <div className = "flex-inline justify-space-between">
                <IndividualItemBox header = {"Correct"} value = {getStudentTriviaDatasResults(selectedItem.triviaDatas).corrects} icon = {CorrectIcon} />
                <IndividualItemBox header = {"Mistakes"} value = {getStudentTriviaDatasResults(selectedItem.triviaDatas).mistakes} icon = {ErrorIcon}/>
                <IndividualItemBox header = {"Ave Time"} value = {`${getStudentAverageTimePerQuestions(selectedItem.triviaDatas)} s`} icon = {TimeIcon}/>
              </div>
              <div className = "flex-column question-card-column">
                {selectedItem.triviaDatas.length > 0 && selectedItem.triviaDatas.map((data : any, index: number) =>
                  <QuestionSummaryItem index = {index} question = {data.question} correctAnswer = {data.correctAnswer} answer = {data.answer} timeToAnswer = {data.timeToAnswer} isCorrect = {data.correct} key = {index}/>
                
                )}
              </div>
            </Modal.Body>
          </div>
        </Modal>
    </div>
  )
}

export function IndividualItemBox({header, value, icon : Icon} : {header : string, value : any, icon : () => JSX.Element}){
  
  return(
    <div className = "flex-inline dataVisualization_individualItemBox">
      <Icon/>
      <div className = "flex-column">
        <p className = "h3-text">{header}</p>
        <p className = "h1-text">{value}</p>
      </div>
    </div>
  )
}

export function QuestionSummaryItem({index, question, correctAnswer, answer, timeToAnswer, isCorrect}: 
                                  {index : number, question : string, correctAnswer : string, answer : string, timeToAnswer : number, isCorrect : boolean}){
  return(
    <div className = "flex-row question-card-row">
      <h1 className={isCorrect ? 'correct' : 'wrong'}> Question {index + 1}</h1>
      <div>
        <p className='card-question'>{question}</p>
        <p className='card-player-answer'>Player&apos;s Answer</p>
        <div className = "flex-inline card-answer">
          {isCorrect? <SmallCorrectIcon/> : <SmallErrorIcon/>}
          <p className='player-answer'>{answer}</p>
          <p className='player-time'>{timeToAnswer}s</p>
        </div>
        {!isCorrect && <div className = "flex-inline card-answer">
          <SmallCorrectIcon/>
          <p className='correct-answer'>{correctAnswer}</p>
        </div>}
      </div>
    </div>
  )
}