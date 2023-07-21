import React, { useEffect, useState } from 'react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { errorColor, passingGrade, successColor } from '../../src/constants';
  
//RENDER PIE CHART CUSTOM COLORS
const COLORS = [successColor, errorColor];
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index}: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

export default function PassPercentagePie({studentGrades}: {studentGrades : number[]}) {

    const [passPercentageData, setPassPercentageData] = useState<{name: string, percentage : number}[]>([{name : "Passed", percentage : 0}, 
                                                                                                        {name : "Failed", percentage : 0}])

    //COMPUTE FOR THE PERCENTAGE OF PASSED AND FAILED STUDENTS
    useEffect(() => {
        if(studentGrades.length > 0){
            const passingGrades = studentGrades.filter(grade => grade >= passingGrade);
            const passPercentage = (passingGrades.length / studentGrades.length) * 100;

            setPassPercentageData([{name : "Passed", percentage : passPercentage  }, {name : "Failed", percentage : 100 - passPercentage}])
        }
    },[studentGrades])

    return (
        <div className = "dataVisualization_chartBackground dataVisualization_pieChart">
            <ResponsiveContainer width= "100%" height = "100%">
                <PieChart width = {400} height = {400}>
                    <Pie
                        dataKey="percentage"
                        data={passPercentageData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        labelLine = {false}
                        label = {renderCustomizedLabel}
                    >
                    {passPercentageData.map((entry, index) => ( <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                    </Pie>
                    <Legend layout="vertical" verticalAlign="middle" align='left'/>
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}
