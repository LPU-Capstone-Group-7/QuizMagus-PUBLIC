import React from 'react'

export default function TimeLimit({timeLimit, setTimeLimit} : {timeLimit : number, setTimeLimit : any}) {
  return (
    <div className="time_form">
    <label> Timer (Minute) </label>
    <input type="number" min={1} value={timeLimit} onChange={event => setTimeLimit(Number(event.target.value))} />
</div>
  )
}
