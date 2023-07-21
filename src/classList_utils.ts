import { arrayUnion, collection, deleteDoc, doc, getDocs, query, updateDoc, where, writeBatch } from "firebase/firestore"
import { db } from "./firebase/firebaseConfig"
import { Student } from "./constants"
import { validateEmail } from "./utils"

export const addSection = async(sectionName : string, studentList : Student[], userUID : string) => {

    const updatedClassEntry = {sectionName, studentList : sortStudentsAlphabetically(studentList)}
    const docRef = doc(db, "userId", userUID)

    await updateDoc(docRef, {
        classList : arrayUnion(updatedClassEntry)
    })
}

export const deleteSection = async(sectionName : string, classList : any[], userUID : string) => {

    const updatedClassList = classList.filter((classItem : any) => classItem.sectionName.toLowerCase() != sectionName.toLowerCase())
    const docRef = doc(db, "userId", userUID)

    //UPDATE CLASS LIST FIELD
    await updateDoc(docRef, {
        classList : updatedClassList
    })

    //CREATE REFERENCE FOR CUSTOMIZED GAME
    const customizedGameRef = collection(db, "customizedGame");
    const q = query(customizedGameRef, where("classEntry", "==", sectionName), where("author.id", "==", userUID));

    //RETRIEVE ALL THE RELATED DOCUMENTS
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (docIndex) => {
        console.log(docIndex.id, " => ", docIndex.data());

        //DELETE ALL RELATED CUSTOMIZED GAME DOCUMENTS 
        deleteDoc(doc(db, "customizedGame", docIndex.id))
        deleteDoc(doc(db, "userId", userUID, "customizedGameDataSnippet", docIndex.id))
        deleteDoc(doc(db, "customizedGameResult", docIndex.id))

    });
}

export const updateSection = async(updatedClassEntry : {sectionName : string, studentList : Student[]}, oldSectionName : string, classList : any[], userUID : string) =>{

    //REMOVE OLD SECTION FROM THE CLASS LIST AND ADD THE NEW UPDATED SECTION
    const updatedClassList = classList.filter((classItem : any) => classItem.sectionName.toLowerCase() != oldSectionName.toLowerCase())
    updatedClassList.push({...updatedClassEntry, studentList : sortStudentsAlphabetically(updatedClassEntry.studentList)})

    const docRef = doc(db, "userId", userUID)

    //UPDATE CLASS LIST FIELD
    await updateDoc(docRef, {
        classList : updatedClassList
    })

    //CREATE REFERENCE FOR CUSTOMIZED GAME
    const customizedGameRef = collection(db, "customizedGame");
    const q = query(customizedGameRef, where("classEntry", "==", oldSectionName), where("author.id", "==", userUID));

    //RETRIEVE ALL THE RELATED DOCUMENTS
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((docIndex) => {
        console.log(docIndex.id, " => ", docIndex.data());

        //UPDATE ALL THE CLASS ENTRIES IN THE RELATED DOCUMENTS
        updateDoc(doc(db, "customizedGame", docIndex.id), {
            classEntry : updatedClassEntry.sectionName
        });
    });
}

export const validateStudentList = (studentList : Student[]) => {

    let studentListIsValid : boolean = true;
    studentList.forEach(student => { if(student.email == '' || student.name == '' || !validateEmail(student.email)) studentListIsValid = false;});

    return studentListIsValid;
}

export const isSectionNameTaken = (sectionName : string, classList : any[]) => classList.some((classIndex) => classIndex.sectionName.toLowerCase() === sectionName.toLowerCase());


export const sortStudentsAlphabetically = (sectionList : Student[]) => sectionList.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));