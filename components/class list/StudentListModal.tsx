import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { Student } from '../../src/constants'
import { changeToTitleCase, containsSubstring } from '../../src/utils'
import SearchInput from '../../components/question bank/SearchInput'

interface props{
    show : boolean,
    setShow : any,
    studentList : Student[],
    sectionName : string

}

export default function StudentListModal({show, setShow, studentList, sectionName} : props) {
    const [searchInput, setSearchInput] = useState<string>('')


    return (
        <Modal show={show} onHide = {() => {setShow(false)}} centered = {true}>
            <div className="class_list-modal-content">
                <div className="list_header">
                    <Modal.Header closeButton>
                        <Modal.Title className='section_title'>
                            <h1>
                            {sectionName} Students
                            </h1>
                            </Modal.Title>
                    </Modal.Header>
                </div>
                    <Modal.Body>
                        <div className="classlist_modal_search">
                            <SearchInput searchInput={searchInput} setSearchInput={setSearchInput} />
                        </div>
                        <div className="section_card">
                            {studentList.map((student, index) => containsSubstring(student.name, searchInput) && (
                                <div key={index} className="individual_card">
                                    <div className="first_column">
                                        <div className="individual_icon"></div>
                                    </div>
                                    <div className="second_column">
                                        <h1>{changeToTitleCase(student.name)}</h1>
                                        <h2>{changeToTitleCase(student.email)}</h2>
                                    </div>
                            </div>
                            ))}
                        </div>
                    </Modal.Body>
            </div>
        </Modal>
    )
}
