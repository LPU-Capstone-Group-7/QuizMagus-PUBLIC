import React from 'react'

export default function DiagonalWord({enableDiagonalWord, setEnableDiagonalWord}: any) {
  return (
    <div className="diagonalword_form">
        <p> Diagonal Words </p>
        <label htmlFor="diagonalword">
            <input 
            type="radio" 
            id="diagonal_input_1" 
            name="diagonal" 
            value="true"
            checked = {enableDiagonalWord}
            onChange={(event) =>  setEnableDiagonalWord(event.target.value === "true")} />
            True
        </label>

        <label htmlFor="diagonalword">
            <input 
            type="radio" 
            id="diagonal_input_2" 
            name="diagonal" 
            value="false"
            checked = {!enableDiagonalWord}
            onChange={(event) =>  setEnableDiagonalWord(event.target.value === "true")} />
            False
        </label>
    </div>
  )
}

