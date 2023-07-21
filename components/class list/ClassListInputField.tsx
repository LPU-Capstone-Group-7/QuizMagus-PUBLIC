import React from 'react'
import { Student } from '../../src/constants'
import { Accordion, Button, Form } from 'react-bootstrap'
import uuid from 'react-uuid'

export default function StudentListInputField({studentList, setStudentList} : {studentList : Student[], setStudentList : any}) {

    //ADD EMPTY STUDENT FIELD
    function addStudentItem(){
        const newItem : Student = {name : '', email : '', id : uuid()}
        setStudentList((prevState: Student[]) => [...prevState, newItem])
    }

    //EDIT STUDENT ITEM VALUES
    function editStudentItem(id : string, targetName : string, targetValue : string){
        const index = studentList.findIndex((student) => student.id === id);
        let updatedClassList = [...studentList];

        updatedClassList[index] = {...updatedClassList[index], [targetName]: targetValue,};
        setStudentList(updatedClassList);
    }

    //REMOVE STUDENT FROM STUDENT ARRAY
    function removeStudentItem(student : Student){
  
        if (studentList.length > 1) {        
            const index = studentList.findIndex((s) => s.id === student.id);

            // IF STUDENT EXISTS, REMOVE IT FROM THE ARRAY
            if (index !== -1) {
                const updatedClassList = [...studentList];
                updatedClassList.splice(index, 1);
                setStudentList(updatedClassList);
            }
        }
    }

  return (
    <>
    <div className="classListInput">
        <Accordion defaultActiveKey="0">
                {studentList.length > 0 && studentList.map((student, index) => (
                    <div className = "flex-inline" key = {index}>
                        <StudentItem index = {index} student={student} editStudentItem={editStudentItem}/>
                        <div className="container_button">
                            <Button onClick = {addStudentItem}>+</Button>
                            <Button onClick = {() => {removeStudentItem(student)}}>-</Button>
                        </div>
                    </div>)
                )}
        </Accordion>
    </div>
    </>
  )
}

export function StudentItem({index, student, editStudentItem } : {index : number, student : Student, editStudentItem : any}){

  return(
    <Accordion.Item eventKey= {index.toString()}>
        <Accordion.Header>{student.name != ''? student.name : `Student #${index + 1}`}</Accordion.Header>
        <Accordion.Body>
            <Form>  {/* STUDENT NAME */}
                <Form.Group className="mb-3">
                    <Form.Label>Student Name</Form.Label>
                    <Form.Control type="text" name = "name" value = {student.name} onChange = {(event) => editStudentItem(student.id, event.target.name, event.target.value)}/>
                </Form.Group> 
            </Form>
            <Form>  {/* STUDENT EMAIL */}
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name = "email" value = {student.email} onChange = {(event) => editStudentItem(student.id, event.target.name, event.target.value)}/>
                </Form.Group> 
            </Form>
        </Accordion.Body>
    </Accordion.Item>
  )
}
