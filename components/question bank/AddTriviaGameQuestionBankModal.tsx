import { useState } from "react";
import TriviaGameQuestionBankModal from "./TriviaGameQuestionBankModal";
import { submitQuestionBankQuery } from "../../src/questionBank_utils";
import { auth } from "../../src/firebase/firebaseConfig";
import { uuidv4 } from "@firebase/util";

export default function AddTriviaQuestionBankModal({showAddQuestionBankModal, setShowAddQuestionBankModal, hasQuestionBankWithSameTitle, defaultTitle, defaultAddQuestion, defaultTags} : 
    {showAddQuestionBankModal : any, setShowAddQuestionBankModal : any, hasQuestionBankWithSameTitle : any, defaultTitle : string, defaultAddQuestion : any[], defaultTags : string[]}){

    //USE STATE FOR STORING TRIVIA GAME QUESTIONS
    const [addQuestion, setAddQuestion] = useState<{question : string, answer: string, difficulty : string, id : string}[]>(defaultAddQuestion)
    const [title, setTitle] = useState(defaultTitle)
    const [sendingQuestionBank, setSendingQuestionBank] = useState<boolean>(false)
    const [tags, setTags] = useState<string[]>(defaultTags)

    async function submmitHandler(event : any){
        if(!auth.currentUser) return;

        await submitQuestionBankQuery(event, auth.currentUser.uid, setSendingQuestionBank, setShowAddQuestionBankModal, hasQuestionBankWithSameTitle, title, tags, addQuestion).
        then( () => {//CLEAN UP THE STATES 
            setTitle('')
            setTags([])
            setAddQuestion([{ question: '', answer: '', difficulty: '', id: uuidv4(),}])
        })
    }

    return( <>
            <TriviaGameQuestionBankModal 
            showQuestionBankModal = {showAddQuestionBankModal} setShowQuestionBankModal = {setShowAddQuestionBankModal}
            title = {title} setTitle = {setTitle} addQuestion = {addQuestion} setAddQuestion = {setAddQuestion} 
            submitHandler = {submmitHandler} loading = {sendingQuestionBank} 
            tags = {tags} setTags = {setTags}
        />
    </>)
}