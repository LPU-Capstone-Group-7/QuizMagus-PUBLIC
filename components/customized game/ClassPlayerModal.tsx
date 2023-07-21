import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { db } from '../../src/firebase/firebaseConfig'
import { Student } from '../../src/constants'
import { toast } from 'react-toastify'
import { sendOTP } from '../../src/smtp_utils'

interface ClassPlayerModalProps{
    showPlayerModal : boolean
    handleClose : () => void
    submitNameHandler: (event: any, input: string) => Promise<void>
    classEntry : string
    authorID : string
}

function generateOTP(){
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
  
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }
  
    return randomString;
}
  
export default function ClassPlayerModal({showPlayerModal, handleClose, submitNameHandler, classEntry, authorID } : ClassPlayerModalProps) {

    const [email, setEmail] = useState<string>('')
    const [emailExists, setEmailExists] = useState<boolean>(false)

    const [studentList, setStudentList] = useState<Student[]>([])
    const [studentCredentials, setStudentCredentials] = useState<Student>();

    const [otp, setOtp] = useState<string>('')
    const [inputtedOTP, setInputtedOTP] = useState<string>()

    useEffect(() => {
        if(authorID == '' || classEntry == '') return;

        const docRef = doc(db, "userId", authorID);

        const querySnapshot = async() => {
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {

              //FIND CLASS ENTRY INSIDE THE CLASS LIST
              const foundClassEntry = docSnap.data().classList.find((entry : any) => entry.sectionName == classEntry);
              setStudentList(foundClassEntry.studentList)
              console.log(foundClassEntry.studentList)
            } else {
                console.log("No such document!");
            }
        }

        querySnapshot();

    },[classEntry])
    async function validateEmail(){
        //CHECK IF EMAIL EXISIS IN THE STUDENT LIST
        console.log(studentList)
        let emailIsValid : boolean = false;
        let selectedStudent : any;
        
        for (const student of studentList) {
            if (student.email.toLowerCase() === email.toLowerCase()) {
                emailIsValid = true;
                selectedStudent = student
                setStudentCredentials(student)
                break;
            }
        }

        //IF THERE IS, SEND OTP IN INPUTTED EMAIL, THEN SHOW INPUT FIELD FOR OTP
        if(emailIsValid){
            const generatedOTP = generateOTP()
            await sendOTP({email, name : selectedStudent?.name ?? "", otp: generatedOTP})
            toast.success("OTP Sent!!!")

            //SET STATES
            setEmailExists(true)
            setInputtedOTP("")
            setOtp(generatedOTP)
        }
        else{
            toast.error("Email does not exist")
            console.log(email.toLowerCase())
        }
    }

    async function verificationHandler(event : any){
        event.preventDefault()

        try {
            if(inputtedOTP != otp) throw "Invalid OTP"
            if(!studentCredentials || studentCredentials.name == "") throw "Something went wrong"

            //LOAD QUIZ MAGUS GAME USING VERIFIED EMAIL'S NAME
            submitNameHandler(event, studentCredentials.name)

        } catch (error) {
            toast.error(error as string)
        }
    }

  return (
    <Modal className="modal" show={showPlayerModal} onHide={handleClose} backdrop="static" keyboard={false} centered = {true}>
      <Modal.Body>
            {!emailExists? <form className = "playermodal">
                <h1>Enter your email</h1>
                <label>
                        <input type = "email" value = {email} onChange = {(event) => {setEmail(event.target.value)}}/>
                </label>
                <div className="submit">
                    <button id="modal_submit" onClick = {validateEmail} type= "button">Verify</button>
                </div>
            </form> : <form className = "playermodal" onSubmit={(event) => {verificationHandler(event)}}>
                <h1>Please Enter OTP sent to your email</h1>
                <label>
                        <input type = "text" value = {inputtedOTP} onChange = {(event) => {setInputtedOTP(event.target.value)}}/>
                </label>
                <div className="submit">
                    <button id="modal_submit" onClick = {verificationHandler} type= "button">Submit</button>
                </div>
            </form>}          
      </Modal.Body>
    </Modal>
  )
}
