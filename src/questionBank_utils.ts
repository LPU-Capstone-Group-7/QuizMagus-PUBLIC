import { arrayUnion, doc, setDoc, updateDoc } from "firebase/firestore"
import { toast } from "react-toastify"
import { db } from "./firebase/firebaseConfig"

export async function submitQuestionBankQuery(event : any, authID : string, setSendingQuestionBank : any, setShowAddQuestionBankModal : any, hasQuestionBankWithSameTitle : any, title: string, tags : string[], addQuestion : any[]){
    event.preventDefault()

    setSendingQuestionBank(true)

    //CREATE QUESTION BANK INDEX
    const questionBankIndex = {
        title,
        tags,
        lastUpdated : new Date(),
        numberOfQuestions : addQuestion.length,
        questions : addQuestion.map((item) => ({question : item.question, answer: item.answer, difficulty : item.difficulty})),
    }

    const questionBankDocRef = doc(db, "triviaGameQuestionBank", authID)

    try{
        //VALIDATE IF THERE IS NO OTHER QUESTION BANK WITH THE SAME TITLE
        if(hasQuestionBankWithSameTitle(title)) throw 'Title already exists'

        setSendingQuestionBank(false)
        setShowAddQuestionBankModal(false)

        //ADD QUESTION BANK INDEX INSIDE THE USER'S QUESTION BANK LIST
        const addQuestionBankDoc = await updateDoc(questionBankDocRef,{
        questionBankList : arrayUnion(questionBankIndex) 
        })

        toast.success("You did it!")
    }
    catch(error){

        try{

            //VALIDATE IF THERE IS NO OTHER QUESTION BANK WITH THE SAME TITLE
            if(hasQuestionBankWithSameTitle(title)) throw 'Title already exists'
            
            //SET A QUESTION BANK DOCUMENT IF THERE IS NO EXISTING QUESITION BANK LIST INSIDE THE DOCUMENT
            const addQuestionBankDoc = await setDoc(questionBankDocRef,{
                questionBankList : arrayUnion(questionBankIndex) 
            })

            toast.success("You did it!")
        }
        catch(error){
            toast.error('Something went wrong')
            console.log(error)
        }

        setSendingQuestionBank(false)
    }
}


