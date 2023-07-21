function RandomizeQuestionsToggle({enableRandomize, setEnableRandomize} : any) {
  return (
    <div className="randomize_form">
        <p> Randomize Questions </p>
        <label htmlFor="random">
            <input 
            type="radio" 
            id="random_input_1" 
            name="random" 
            value="true"
            checked = {enableRandomize}
            onChange={(event) =>  setEnableRandomize(event.target.value === "true")} />
            True
        </label>

        <label htmlFor="random">
            <input 
            type="radio" 
            id="random_input_2" 
            name="random"
            value="false" 
            checked = {!enableRandomize}
            onChange={(event) =>  setEnableRandomize(event.target.value === "true")} />
            False 
        </label>
    </div>
  )
}

export default RandomizeQuestionsToggle