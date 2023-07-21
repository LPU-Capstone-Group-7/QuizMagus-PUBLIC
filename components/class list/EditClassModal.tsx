import { useState } from "react";
import ClassModal from "./ClassModal";
import { Student } from "../../src/constants";
import uuid from "react-uuid";
import { isSectionNameTaken, updateSection, validateStudentList } from "../../src/classList_utils";
import { toast } from "react-toastify";

interface EditClassModalProps{
    show : boolean, 
    setShow : any, 
    userUID : string,
    classList : any[],
    classEntry : any,
}

export default function EditClassModal({show, setShow, userUID, classList, classEntry} : EditClassModalProps) {

    const [sectionName, setSectionName] = useState<string>(classEntry?.sectionName ?? '')
    const [studentList, setStudentList] = useState<Student[]>(classEntry && classEntry.studentList.length > 0? classEntry.studentList : [{name : '', email : '', id : uuid()}]) 
    
    //UPDATE STUDENT LIST TO CLASS LIST COLLECTION
    async function editStudentList(){

        const isClassListValid : boolean = validateStudentList(studentList);
        const isSectionNameValid : boolean = sectionName.toLowerCase() == classEntry.sectionName.toLowerCase() || !isSectionNameTaken(sectionName, classList);

        try{
            //THROW ERROR IF FIELDS ARE INVALID
            if(!isClassListValid) throw "Some student fields are invalid"
            if(!isSectionNameValid) throw "This section already exists"

            //CREATE UPDATED CLASS ENTRY
            const updatedClassEntry : {sectionName: string, studentList: Student[];} = {sectionName : sectionName, studentList : studentList}

            if(studentList.length > 0){
                updateSection(updatedClassEntry, classEntry.sectionName, classList, userUID);

                toast.success("Updated Student List!")
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
        setSectionName(classEntry.sectionName)
        setStudentList(classEntry.studentList)
    }

    return (
    <>
        <ClassModal
            show = {show}
            sectionName = {sectionName} setSectionName= {setSectionName}
            studentList= {studentList} setStudentList={setStudentList}
            closeHandler={closeHandler} submitHandler={editStudentList}
            headerText="Planning to change something?" buttonText="Save Class"
        />
    </>
  )
}
