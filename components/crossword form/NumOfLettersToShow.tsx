import React from 'react'

export default function NumOfLettersToShow({numOfLettersToShow, setNumOfLettersToShow} : {numOfLettersToShow : number, setNumOfLettersToShow :  any}) {
  return (
    <div className="time_form">
            <label> Number of letters to show (min: 2) </label>
            <input type="number" max={20} min={2} value={numOfLettersToShow} onChange={event => setNumOfLettersToShow(Number(event.target.value))} 
        />
    </div>
  )
}
