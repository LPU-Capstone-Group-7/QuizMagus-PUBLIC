import React from 'react'

export default function ReverseWord({enableReversedWord, setEnableReversedWord} : any) {
  return (
    <div className="reversedword_form">
        <p> Reversed Words </p>
        <label htmlFor="reversedword">
            <input 
            type="radio" 
            id="reversed_input_1" 
            name="reversed" 
            value="true"
            checked = {enableReversedWord}
            onChange={(event) =>  setEnableReversedWord(event.target.value === "true")} />
            True
        </label>

        <label htmlFor="reversedword">
            <input 
            type="radio" 
            id="reversed_input_2" 
            name="reversed" 
            value="false"
            checked = {!enableReversedWord}
            onChange={(event) =>  setEnableReversedWord(event.target.value === "true")} />
            False
        </label>
    </div>
  )
}
