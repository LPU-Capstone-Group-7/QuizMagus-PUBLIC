import { uuidv4 } from "@firebase/util"
import { query, collection, where, getDocs, doc, getDoc } from "firebase/firestore"
import moment from "moment"
import { useEffect } from "react"
import { toast } from "react-toastify"
import { auth, db } from "./firebase/firebaseConfig"

const emailFormat = /\S+@\S+\.\S+/;
export const validateEmail = (email : string) => emailFormat.test(email)

export const timestampStringToDate = (timestampString : string) => new Date(Date.parse(timestampString))
export const dateToStringFormat = (date : Date)  => moment(date).format("MMM Do YYYY, h:mm a")

export const timeFormatter = (totalSeconds : number) => {
    const minutes = totalSeconds/60
    const seconds = totalSeconds%60

    return {minutes, seconds}
}

export const sendSerializableClass = (object : any) => {
    const jsonStringify : string = JSON.stringify(object)
    return JSON.parse(jsonStringify)
}

export function changeToTitleCase( input: string ) {
    if(!input) return ''
    input = input.replace(/\s+/g, ' ');
    const words = input.toLowerCase().split(' ');
    const titleCasedWords = words.map((word) =>{
        if(!word) return ''
        return word[0].toUpperCase() + word.slice(1)
    });
    
    return titleCasedWords.join(" ");
  }

export function copyGameLink(title : string, id : string){
   const customizedGameLink : string =  generateCustomizedGameLink(title, id);
   navigator.clipboard.writeText(customizedGameLink).then(() => toast.success("Copied Link"))
}

export function generateCustomizedGameLink(title: string, id: string) {
    const encodedTitle = encodeURIComponent(title);
    const encodedId = encodeURIComponent(id);
    const customizedGameLink: string = `${location.origin}/play/${encodedTitle}/${encodedId}`;
    return customizedGameLink;
}

export const titleAlreadyExists = async(title : string) => {
    
    if(!title) return false
    
    const q = query(collection(db, "customizedGame"), where("title", "==", changeToTitleCase(title)));
    const querySnapshot = await getDocs(q);
    
    return !querySnapshot.empty
    
}

export const validateGeneralGameSettings = (title : string, basedGrading : string, allowedAttempts : number, startDate : Date, endDate : Date) => {
    
    try{
        // CHECK IF TITLE FIELD HAS AN INPUT 
        if (!title) throw 'Please Enter the Title' 
        if (basedGrading === "0") throw 'Please Select a Based Grading' // CHECK IF BASED GRADING HAS AN INPUT
        if (!allowedAttempts)throw 'Please Fill out the Number of Attempts Field' // CHECK IF NUMBER OF ATTEMPTS FIELD HAS AN INPUT
        if (startDate > endDate)throw 'Start date must be earlier than End date' // CHECK IF END DATE IS NOT EARLIER THAN START DATE

        return {message : '', isValid : true}
    }
    catch(error){
        return {message : error as string, isValid : false}
    }
}

//CHECKS IF STRING CONTAINS THIS SPECIFIC SUBSTRING
export const containsSubstring = (text: string, substring: string): boolean => {
  const lowercaseText = text.toLowerCase();
  const lowercaseSubstring = substring.toLowerCase();

  return lowercaseText.includes(lowercaseSubstring);
};

//FOR SEARCH TAG INPUT AND CHECKING IF TAGS ARRAY CONTAIN ALL OF THE TAG INPUT
export const containsTagSearches = (tags : string[], searchTagInput : string[]) => {

let hasAllTags : boolean = true;
searchTagInput.forEach(tagInput => {
    if(!tags.includes(tagInput)) {
    hasAllTags = false
    return;
    }
});

return hasAllTags;
}


// ** ============================================== **
// **    QUESTION BANK GENERATOR UTILITY FUNCTIONS   **
// ** ============================================== **

export const splitQuizGptResponse = (quiz : string) =>{

    //SPLIT THE RESPONSE INTO AN ARRAY
    const quizItems = quiz.split("==")
    const questions : {question : string, answer: string, difficulty : string, id: string}[] = []

    quizItems.forEach((item) => {
        const itemArray = item.split("//").map((text) => text.trim()); // Split the quiz item into an array and remove whitespace
        const question = {question : itemArray[0] ?? '', answer: itemArray[1] ?? '', difficulty: 'normal', id: uuidv4()}

        questions.push(question)
    });

    return questions
}


// SETTING CURRENTUSER AS AUTHOR
export async function setCurrentUserAsAuthor(id: string, setAuthor: any) {
    if (auth.currentUser !== null) {
    const docRef = doc(db, "userId", id);
    const docSnap = await getDoc(docRef);

    docSnap.exists() && setAuthor({ id, name: docSnap.data().username });
    !docSnap.exists() && console.log("user doesn't exist: " + id);
    }
}

