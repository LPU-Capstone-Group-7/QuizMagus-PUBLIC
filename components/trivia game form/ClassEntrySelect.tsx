import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'
import { db } from '../../src/firebase/firebaseConfig';

export default function ClassEntrySelect({classEntry, setClassEntry, userUID} : {classEntry : string, setClassEntry : any, userUID : string}) {
  
    const [classList, setClassList] = useState<string[]>([])
    useEffect(() => {
        if(!userUID) return;

        const docRef = doc(db, "userId", userUID);

        const querySnapshot = async() => {
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                //GET THE LIST OF SECTIONS INSIDE THE CLASS LIST
                const classList : string[] = []
                
                if(docSnap.data().classList){
                    docSnap.data().classList.map((classEntry : any) => {classList.push(classEntry.sectionName)})
                    setClassList(classList)
                }


            } else {
                console.log("No such document!");
            }
        }

        querySnapshot();
    },[])
  
    return (
        <div className="gradingSystemInput">
            <label htmlFor="gradingSystem"> Assign Class </label>
            <Form.Select aria-label="based_grading" value={classEntry ? classEntry : 'Select Based Grading'} onChange={(event) => setClassEntry(event.target.value)}>
                <option value='' >None</option>
                {userUID && classList.length > 0 && classList.map((classEntry) => (<>
                    <option value={classEntry} >{classEntry}</option>
                </>))}                
            </Form.Select>
        </div>
    )
}
