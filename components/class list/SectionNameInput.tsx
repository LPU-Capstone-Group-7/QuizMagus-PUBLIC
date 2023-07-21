import React from 'react'
import { Form } from 'react-bootstrap'

export default function SectionNameInput({sectionName, setSectionName} : {sectionName : string, setSectionName : any}) {
  return (
    <Form.Group className="mb-3">
        <Form.Control 
            placeholder="Title" type="text" maxLength={60} value={sectionName} onChange = {(event : any) => setSectionName(event.target.value)} 
            className={sectionName.length >= 60 ? "title_error" : ""}
        />

        {sectionName.length >= 60 && <h6> Minimum 60 characters </h6>}
    </Form.Group>
  )
}
