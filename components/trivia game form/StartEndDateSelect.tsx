import moment from "moment";
import { useEffect, useState } from "react"

export default function StartEndDateSelect({startDate, setStartDate, endDate, setEndDate} : {startDate : Date, setStartDate : any, endDate : Date, setEndDate : any}) {
    const [formattedStartDate, setFormattedStartDate] = useState('')
    const [formattedEndDate, setFormattedEndDate] = useState('')

    useEffect(() => {
        setFormattedStartDate(moment(startDate).format("YYYY-MM-DDTHH:mm"));
        setFormattedEndDate(moment(endDate).format("YYYY-MM-DDTHH:mm"));
    },[startDate, endDate])
    return (
    <div className="start_end_date">
        <label>
        Start date:
            <input type="datetime-local" name="startDate" id="startDate" 
                value={formattedStartDate}
                onChange={(e) => setStartDate(new Date(e.target.value))}
            />
        </label>
        <label>
        End date:
            <input type="datetime-local" name="endDate" id="endDate" 
                value={formattedEndDate}
                onChange={(e) => setEndDate(new Date(e.target.value))}
            />
        </label>
    </div>
  )
}