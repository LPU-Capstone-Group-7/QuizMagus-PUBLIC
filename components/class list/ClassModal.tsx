import { Button, Modal } from "react-bootstrap"
import { Student } from "../../src/constants"
import SectionNameInput from "./SectionNameInput"
import StudentListInputField from "./ClassListInputField"

interface ClassModalProps{
    show : boolean, 
    sectionName : string,
    setSectionName : any,
    studentList : Student[],
    setStudentList : any,
    closeHandler : () => void,
    submitHandler : () => void,
    headerText : string
    buttonText : string
}

export default function ClassModal({show, sectionName, setSectionName, studentList, setStudentList, closeHandler, submitHandler, headerText, buttonText} : ClassModalProps) {
  return (
    <>
        <Modal show={show} onHide={closeHandler} centered = {true}>
            <div className="class_list-modal-content">
                <div className="list_header">
                    <Modal.Header closeButton>
                        <Modal.Title>{headerText}</Modal.Title>
                    </Modal.Header>
                </div>
                    <Modal.Body>
                        <SectionNameInput sectionName = {sectionName} setSectionName = {setSectionName}/>
                        <StudentListInputField studentList={studentList} setStudentList = {setStudentList}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="submit">
                            <Button id="modal_submit" variant="primary" onClick={submitHandler}>
                                {buttonText}
                            </Button>
                        </div>
                    </Modal.Footer>
            </div>
        </Modal>
    </>
  )
}
