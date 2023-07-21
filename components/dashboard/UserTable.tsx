import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { auth, db } from '../../src/firebase/firebaseConfig';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Link from 'next/link';
import { containsSubstring, dateToStringFormat, generateCustomizedGameLink } from '../../src/utils';
import GameIcon from './GameIcon';

export default function UserTable({gameData, searchInput} : {gameData : any [], searchInput : string}){

const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false); // MODAL FOR DELETE DOC
const[selectedItem, setSelectedItem] = useState<any>({id : '', title : ''})


const onDelete = async (id: string, title: any) => { // DELETING DOC
        try {
            setShowDeleteConfirmationModal(false);
            toast.success('Documents successfully deleted!');
            await deleteDoc(doc(db, `userId/${auth.currentUser?.uid}/customizedGameDataSnippet`, id));
            await deleteDoc(doc(db, 'customizedGame', id));
            await deleteDoc(doc(db, 'customizedGameResult', id));
        
        const studentResultsDocs = await getDocs(collection(db, `customizedGameResult/${id}/studentResults`));
        studentResultsDocs.forEach(doc => deleteDoc(doc.ref));
        
        } catch (e) {
        setShowDeleteConfirmationModal(false);
        console.error('Error deleting documents: ', e);}
    };


const copyGameLink = (title: string, id: string) => { //SHARE
    const link = generateCustomizedGameLink(title, id)
    navigator.clipboard.writeText(link); // COPY LINK
    toast.success('The game link has been copied to your clipboard!');
    return link;};

const getStudentResultPageLink = (id : string) => {

    //OPEN THE USER STUDENT RESULT PAGE ON NEW TAB
    const studentResultPageLink = `${location.origin}/result/${id}`
    return studentResultPageLink;
}

const getEditGameLink = (id: string, gameType : string) => {
    //CONVERT GAME TYPE'S FIRST LETTER TO SMALL LETTER TO MATCH PAGE DIRECTORY
    const gameTypeDirectoryString = gameType.charAt(0).toLowerCase() + gameType.slice(1)

    //OPEN THE EDIT GAME PAGE ON NEW TAB
    const editGameLink = `${location.origin}/edit/${gameTypeDirectoryString}/${id}`
    return editGameLink;
}

    return (
    <>
    <div className="content_table">
        <table className='table-zebra'>
            <thead>
                <tr>
                    <th></th>
                    <th>Title</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                </tr>
            </thead>

            <tbody>
            {gameData.map((item, index) => {
                if(!searchInput || containsSubstring(item.title, searchInput)){
                    return (
                    <tr key={index}>
                        <td className='game_icon'> <GameIcon gameType={item.gameType} /> </td>
                        <th> {item.title}</th>
                        <th>{dateToStringFormat(item.startDate.toDate())}</th>
                        <th>{dateToStringFormat(item.endDate.toDate())}</th>
                        <td>
                            <div className="dropdown">
                                <button className="kebab_dashboard">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                                    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                                    </svg>
                                </button>
                                <div className="dropdown-content">
                                    <Link href = {getStudentResultPageLink(item.id)}><button>View</button></Link>
                                    <Link href= {getEditGameLink(item.id, item.gameType)}><button>Edit</button></Link>
                                    <button onClick={() => {setSelectedItem(item); setShowDeleteConfirmationModal(true)}}>Delete</button>
                                    <button onClick={() => copyGameLink(item.title, item.id)}> Share </button>
                                </div>
                            </div>
                        </td>
                    </tr>
                    )}
                })}
            </tbody>
        </table>
        <Modal show={showDeleteConfirmationModal} onHide={() => setShowDeleteConfirmationModal(false)} centered>
            <div className="deletedoc_modal">
                <Modal.Header closeButton>
                <Modal.Title>Delete Confirmation</Modal.Title></Modal.Header>
                <Modal.Body>Are you sure you want to delete &rdquo;{selectedItem.title}&rdquo;?</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowDeleteConfirmationModal(false)}>Cancel</Button>
                <Button variant="primary" onClick={() => onDelete(selectedItem.id, selectedItem.title)}>Delete</Button>
                </Modal.Footer>
            </div>
        </Modal>
    </div>
    </>
)
}