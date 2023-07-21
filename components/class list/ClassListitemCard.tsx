import React, { useState } from 'react'
import { Student } from '../../src/constants'
import { Button, Modal } from 'react-bootstrap'
import Link from 'next/link'
import EditClassModal from './EditClassModal'
import StudentListModal from './StudentListModal'

interface Props{
  classEntry : {sectionName : string, studentList : Student[]},
  editHandler : any
  deleteHandler : any 
}

export default function ClassListitemCard({editHandler, deleteHandler, classEntry} : Props) {

    const [showStudentList, setShowStudentList] = useState<boolean>(false)
  return (
    <>
        <div className="classlist_card_container">
          <div className="cl_first_column">
            <div className="cl_icon"></div>
          </div>

          <div className="cl_second_column">
            <h1>{classEntry.sectionName }</h1>
            <h2> {classEntry. studentList.length} Students</h2>
          </div>

          <div className="cl_third_column">
            <p onClick = {() => {setShowStudentList(true)}}> View Details </p>
            <div className="listitem_buttons">
                  <Button onClick={() => {editHandler(classEntry)}}> {/**EDIT BUTTON */}
                    <svg width={23} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">  
                      <path d="M18.13.973L15.123 3.98l6.013 6.013 3.007-3.007L18.129.973zm-6.014 6.013L.089 19.013v6.014h6.014L18.13 13l-6.014-6.014z" fill="#6D1CFF"/>
                    </svg>
                  </Button>
                  <Button onClick={() => {deleteHandler(classEntry)}}> {/**DELETE BUTTON */}
                    <svg width="22" height="25" viewBox="0 0 25 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.4287 0.285767C8.54296 0.285767 7.0001 1.82862 7.0001 3.71434H3.57153C1.68582 3.71434 0.14296 5.25719 0.14296 7.14291H24.143C24.143 5.25719 22.6001 3.71434 20.7144 3.71434H17.2858C17.2858 1.82862 15.743 0.285767 13.8572 0.285767H10.4287ZM3.57153 10.5715V27.0629C3.57153 27.4401 3.84582 27.7143 4.22296 27.7143H20.0972C20.4744 27.7143 20.7487 27.4401 20.7487 27.0629V10.5715H17.3201V22.5715C17.3201 23.5315 16.5658 24.2858 15.6058 24.2858C14.6458 24.2858 13.8915 23.5315 13.8915 22.5715V10.5715H10.463V22.5715C10.463 23.5315 9.70867 24.2858 8.74867 24.2858C7.78867 24.2858 7.03439 23.5315 7.03439 22.5715V10.5715H3.60582H3.57153Z" fill="#6D1CFF"/>
                    </svg>
                  </Button>
                </div>
          </div>
        </div>

        <StudentListModal show = {showStudentList} setShow={setShowStudentList} studentList={classEntry.studentList} sectionName = {classEntry.sectionName}/>
    </>
  )
}
