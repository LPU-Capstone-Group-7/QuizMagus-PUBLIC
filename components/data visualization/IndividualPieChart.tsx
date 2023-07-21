import { Cell, Pie, PieChart } from 'recharts';


export default function IndividualPieChart({totalGrade} : {totalGrade : number}) {
    const data = [
        {id : "1" , name: "L1", value: 100 - totalGrade},
        {id: "2", name: "L2", value: totalGrade}
        ];

  return (
    <>
        <PieChart width={90} height={90}>
            <text
                x={45}
                y={45}
                textAnchor="middle"
                dominantBaseline="middle">{totalGrade}%</text>
            <Pie
                data={data}
                dataKey="value"
                innerRadius="80%"
                outerRadius="100%"
                fill="yellowgreen"
                startAngle={90}
                endAngle={-270}
                paddingAngle={0}
                cornerRadius={5}>
                <Cell
                key="test"
                fill="red"/>
            </Pie>
        </PieChart>
    </>
  )
}

