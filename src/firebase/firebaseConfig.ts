import { initializeApp } from 'firebase/app';
import { addDoc, collection, getFirestore, setDoc, doc, updateDoc } from 'firebase/firestore';
import { getAuth, updateCurrentUser } from 'firebase/auth';
import { changeToTitleCase } from '../utils';

export const firebaseConfig = YOUR API KEY HERE

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();

//Firebase Reference
export const userRef = collection(db, 'userId')

const customizedGameRef = collection(db, "customizedGame");

//SEND CUSTOMIZED GAME DATA TO FIREBASE
export async function addCustomizedGameData(
                                            title : string,  
                                            classEntry : string,
                                            basedGrading : string,
                                            allowedAttempts : number, 
                                            author : {name : string, id : string}, 
                                            startDate : Date,
                                            endDate : Date,
                                            gameSettingsJSON : string,
                                            gameType : string){

    //ADDS THE CUSTOMIZED GAME TO FIREBASE
    const customizedGameDoc = await addDoc(customizedGameRef, {
        title : changeToTitleCase(title),
        classEntry : classEntry,
        basedGrading,
        allowedAttempts,
        author,
        startDate : new Date(startDate),
        endDate : new Date(endDate),
        gameSettingsJSON,
        gameType,
    })
    
    return customizedGameDoc.id;
}  

export async function addCustomizedGameDataSnippet(
        id: string,
        title: string,
        startDate: Date,
        endDate: Date,
        gameType : string){

    if(auth.currentUser){
        const customizedGameSnippetRef = doc(db, 'userId', auth.currentUser?.uid, "customizedGameDataSnippet", id)
        const customizedGameDataSnippetDoc = await setDoc(customizedGameSnippetRef,{
            id,
            title,
            startDate : new Date(startDate),
            endDate : new Date(endDate),
            gameType
        })
    }
}

export async function updateCustomizedGameData(
    customizedGameId : string,
    title : string,  
    classEntry : string,
    allowedAttempts : number, 
    startDate : Date,
    endDate : Date,
    gameSettingsJSON : string){
    
    const customizedGameDoc = doc(customizedGameRef, customizedGameId)
    await updateDoc(customizedGameDoc, {
        title,
        classEntry,
        allowedAttempts,
        startDate,
        endDate,
        gameSettingsJSON,
    }).then( async () => { //MODIFIES THE TITLE, START DATE, END DATE IN THE CUSTOMIZED GAME DATA SNIPPET IF APPLICABLE
        if(auth.currentUser){
            const customizedGameSnippetRef = doc(db, 'userId', auth.currentUser?.uid, "customizedGameDataSnippet", customizedGameId)
            await updateDoc(customizedGameSnippetRef,{
                title,
                startDate : new Date(startDate),
                endDate : new Date(endDate),
            })
        }
    })
}