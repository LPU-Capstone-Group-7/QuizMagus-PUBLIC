import { useState } from "react";
import { Student } from "../../src/constants";
import uuid from "react-uuid";
import { toast } from "react-toastify";
import { addSection, isSectionNameTaken, validateStudentList } from "../../src/classList_utils";
import ClassModal from "./ClassModal";

interface AddClassModalProps{
    show : boolean, 
    setShow : any, 
    userUID : string,
    classList : any[]
}

export default function AddClassModal({show, setShow, userUID, classList} : AddClassModalProps) {

    const [sectionName, setSectionName] = useState<string>('')
    const [studentList, setStudentList] = useState<Student[]>([{name : '', email : '', id : uuid()}]) 
    
    //ADD STUDENT LIST TO CLASS LIST COLLECTION
    async function addStudentList(){

        const isClassListValid : boolean = validateStudentList(studentList);
        const isSectionTaken : boolean = isSectionNameTaken(sectionName, classList);

        try{
            //THROW ERROR IF FIELDS ARE INVALID
            if(!isClassListValid) throw "Some student fields are invalid"
            if(isSectionTaken) throw "This section already exists"

            if(studentList.length > 0){
                addSection(sectionName, studentList, userUID);

                toast.success("New Section Added!")
                closeHandler()
            }
        }
        catch(error){
            toast.error(error as string);
            console.log(error)
        }
    }

    function closeHandler(){
        setShow(false)
        setSectionName("")
        setStudentList([{name : '', email : '', id : uuid()}])
    }

    return (
    <>
        <ClassModal
            show = {show}
            sectionName = {sectionName} setSectionName= {setSectionName}
            studentList= {studentList} setStudentList={setStudentList}
            closeHandler={closeHandler} submitHandler={addStudentList}
            headerText = "Add a class to your new line up?" buttonText="Add Class"
        />
    </>
    )
}
