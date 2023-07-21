import React from 'react'
import {Form } from 'react-bootstrap'

export default function GradingSystemInput({basedGrading, setBasedGrading} : any) {
  return (
    <div className="gradingSystemInput">
        <label htmlFor="gradingSystem"> Grading System </label>
        <Form.Select aria-label="based_grading" value={basedGrading ? basedGrading : 'Select Based Grading'} onChange={(event) => setBasedGrading(event.target.value)}>
            <option disabled value="0">  Open this select menu</option>
            <option value="based 50" >Score-based 50</option>
            <option value="based 60" >Score-based 60</option>
        </Form.Select>
    </div>
  )
}
