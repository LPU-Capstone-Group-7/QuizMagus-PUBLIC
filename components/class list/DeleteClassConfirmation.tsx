import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import { deleteSection } from '../../src/classList_utils'
import { toast } from 'react-toastify'

interface Props{
    showDeleteConfirmation : boolean
    setShowDeleteConfirmation : any
    classEntry : any
    classList : any
    userUID : string
}

export default function DeleteClassConfirmation({showDeleteConfirmation, setShowDeleteConfirmation, classEntry, classList, userUID} : Props) {
 
    async function deleteClassEntry(){
        try{
            deleteSection(classEntry.sectionName, classList, userUID)
            setShowDeleteConfirmation(false)
            toast.success("Deleted Class List")
        }
        catch{
            toast.error("Oops, something went wrong")
        }
    }

    return (
    <Modal show={showDeleteConfirmation} backdrop="static" keyboard={false} centered>
        <div className="deletedoc_modal">
          <Modal.Header>
          <Modal.Title>Delete Confirmation</Modal.Title></Modal.Header>
          <Modal.Body>
             Are you sure you want to delete &quot;{classEntry.sectionName}&quot; class? All related games would also be deleted.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => {setShowDeleteConfirmation(false)}}> Cancel </Button>
            <Button variant="primary" onClick={() => {deleteClassEntry()}}> Delete </Button>
          </Modal.Footer>
        </div>
      </Modal>
  )
}
