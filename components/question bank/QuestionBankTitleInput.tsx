import React from 'react'
import { Form } from 'react-bootstrap'

export default function QuestionBankTitleInput({title, setTitle} : {title: string, setTitle : any}) {
  return (
    <Form.Group className="mb-3">
        <Form.Control placeholder="Title" type="text" maxLength={60} value={title} onChange = {(event : any) => setTitle(event.target.value)} 
        className={title.length >= 60 ? "title_error" : ""}/>
        {title.length >= 60 && <h6> Minimum 60 characters </h6>}
    </Form.Group>
  )
}
