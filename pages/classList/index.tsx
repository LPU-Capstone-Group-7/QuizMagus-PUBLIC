import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import { Button, ListGroup, Stack } from 'react-bootstrap'
import SearchInput from '../../components/question bank/SearchInput'
import AddClassModal from '../../components/class list/AddClassModal'
import { useAuth } from '../../components/AuthStateContext'
import { auth, db } from '../../src/firebase/firebaseConfig'
import { doc, onSnapshot } from 'firebase/firestore'
import ClassListitemCard from '../../components/class list/ClassListitemCard'
import EditClassModal from '../../components/class list/EditClassModal'
import DeleteClassConfirmation from '../../components/class list/DeleteClassConfirmation'
import { containsSubstring } from '../../src/utils'

export default function ClassList() {
    //USER AUTHENTICATION TO MAKE SURE THE THE USER IS LOGGED IN WHEN CREATING THE GAME
    const{authUser, loading} = useAuth()
    const [userUID, setUserUID] = useState<string>('');

    const [classList, setClassList] = useState<any[]>([])
    const [showAddClassListModal, setShowAddClassListModal] = useState<boolean>(false)
    const [searchInput, setSearchInput] = useState<string>('')

    const [selectedClassEntry, setSelectedClassEntry] = useState<any>();
    const [showEditModal, setShowEditModal] = useState<boolean>(false)
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false)

    //GET USER UID
    useEffect(() => {
        if (!auth.currentUser) return;

        setUserUID(auth.currentUser.uid)

    },[authUser])

    //GETS THE QUESTION BANK ITEMS FROM FIREBASE
    useEffect(() => {
    
        if(userUID == "") return;

        // GET USER'S CLASS LIST DOCUMENT REFERENCE
        const userClassListRef = doc(db, "userId", userUID);

        const unsub = onSnapshot(userClassListRef, (doc) => {
            if(doc.exists()){
                setClassList(doc.data().classList ?? [])
                console.log(doc.data().classList)
            }
        });

        return () => unsub();

    }, [userUID]);


    function editHandler(classEntry : any){
        setSelectedClassEntry(classEntry);
        setShowEditModal(true)
    }

    function deleteHandler(classEntry : any){
        setSelectedClassEntry(classEntry)
        setShowDeleteConfirmation(true)
    }


  return (<>
    <title> Class List </title>
    <Navbar />

    <div className="questionBankNav">
        <h1> Class List </h1>
        <div className="questionBankbuttons">
            <Button className = "questionBank_addButton" variant = "primary" onClick = {() => setShowAddClassListModal(true)}>
                <svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.5 0v7.5H0v5h7.5V20h5v-7.5H20v-5h-7.5V0h-5z" fill="#6D1CFF" />
                </svg>
            </Button>
            <SearchInput searchInput={searchInput} setSearchInput={setSearchInput} />
        </div>
    </div>

    <div className="classList_content">
        <ListGroup style={{ marginLeft: 'auto', marginRight: 'auto', width: '60rem' }}>
        <Stack gap={3} className="classlist_container">
            {classList && classList.length > 0 && classList.map(classEntry => containsSubstring(classEntry.sectionName, searchInput) && (
            <ClassListitemCard classEntry={classEntry} editHandler={editHandler} deleteHandler={deleteHandler} key={classEntry.sectionName}/>
        ))}
        </Stack>
        </ListGroup>
    </div>

    <AddClassModal show = {showAddClassListModal} setShow={setShowAddClassListModal} userUID= {userUID} classList = {classList}/>
    {showEditModal && <EditClassModal show = {showEditModal} setShow={setShowEditModal} userUID= {userUID} classList= {classList} classEntry={selectedClassEntry}/>}
    {showDeleteConfirmation && <DeleteClassConfirmation showDeleteConfirmation = {showDeleteConfirmation} setShowDeleteConfirmation={setShowDeleteConfirmation} classEntry={selectedClassEntry} classList={classList} userUID={userUID}/>}
    </>
)
}


