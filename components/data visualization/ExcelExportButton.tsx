import { useEffect, useState } from "react"
import { passingGrade } from "../../src/constants";
import { getStudentTriviaDatasResults } from "../../src/dataVisualization_utils";
import { changeToTitleCase } from "../../src/utils";

export default function ExcelExportButton({studentResults, title} : {studentResults : any[], title : string}) {
  
    const [rows, setRows] = useState<any[]>([])
    useEffect(() => {
        const studentResultRows = studentResults.map(result => ({
            name: changeToTitleCase(result.id),
            datePlayed: new Date(result.datePlayed.toDate()),
            numberOfAttempts: result.numberOfAttempts,
            correct: getStudentTriviaDatasResults(result.triviaDatas).corrects,
            mistake: getStudentTriviaDatasResults(result.triviaDatas).mistakes,
            totalGrade: result.totalGrade,
            result : result.totalGrade >= passingGrade? "Pass" : "Fail"
        }));

        setRows(studentResultRows)
    },[studentResults])

    function handleExcelExport(){
        const XLSX = require("xlsx");

        //GENERATE WORKSHEET AND WORKBOOK USING THE ROWS STATE
        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();

        //NAME WORKSHEET TO "STUDENT RESULTS" AND CREATE HEADER FOR EACH OBJECT KEYS
        XLSX.utils.book_append_sheet(workbook, worksheet, "Student Results");
        XLSX.utils.sheet_add_aoa(worksheet, [["NAME", "DATE PLAYED", "ATTEMPTS", "CORRECTS", "MISTAKES", "TOTAL GRADES", "RESULT"]], { origin: "A1"});

        //COLUMN WIDTH FOR EACH COLUMNS INSIDE THE WORKSHEET
        const max_name_width = rows.reduce((w, r) => Math.max(w, r.name.length), 10);
        worksheet["!cols"] = [ { wch: max_name_width }, {wch: 20}, {wch: 20}, {wch: 15}, {wch: 15}, {wch: 15}, {wch: 20},];

        XLSX.writeFile(workbook, `${title ?? "studentResults"}.xlsx`, { compression: true });
    }
  
    return (
    <button disabled = {studentResults.length == 0} onClick = {handleExcelExport} className = "export-btn">
        <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M7.5 11.29l4.5 4.373m0 0l4.5-4.374M12 15.663V4M3 18.579a29.204 29.204 0 0018 0"
                stroke="#6D1CFF"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    </button>
  )
}
