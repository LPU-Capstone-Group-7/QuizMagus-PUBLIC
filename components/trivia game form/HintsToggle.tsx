export default function HintsToggle({enableHints, setEnableHints} : any) {
  return (
    <div className="hints_form">
        <p> Enable Hints </p>
        <label htmlFor="hints">
            <input 
            type="radio" 
            id="hints_input_1" 
            name="hints" 
            value="true"
            checked = {enableHints}
            onChange={(event) =>  setEnableHints(event.target.value === "true")} />
            True
        </label>

        <label htmlFor="hints">
            <input 
            type="radio" 
            id="hints_input_2" 
            name="hints" 
            value="false"
            checked = {!enableHints}
            onChange={(event) =>  setEnableHints(event.target.value === "true")} />
            False
        </label>
    </div>
  )
}