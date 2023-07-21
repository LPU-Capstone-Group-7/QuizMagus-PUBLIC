import React from 'react'

export default function ShowCorrectAnswer({showCorrectAnswer, setShowCorrectAnswer} : any) {
  return (
    <div className="correct_form">
        <p> Show Correct Answer </p>
        <label htmlFor="correctanswer">
            <input 
            type="radio" 
            id="correct_input_1" 
            name="correct" 
            value="true"
            checked = {showCorrectAnswer}
            onChange={(event) =>  setShowCorrectAnswer(event.target.value === "true")} />
            True
        </label>

        <label htmlFor="correctanswer">
            <input 
            type="radio" 
            id="correct_input_2" 
            name="correct" 
            value="false"
            checked = {!showCorrectAnswer}
            onChange={(event) =>  setShowCorrectAnswer(event.target.value === "true")} />
            False
        </label>
    </div>
  )
}
