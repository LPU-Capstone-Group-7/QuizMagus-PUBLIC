import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { successColor, errorColor, yellowColor } from "../../../src/constants";
import { getTriviaQuestionResultsData, getValuePercentage } from "../../../src/dataVisualization_utils";
import { TooltipProps } from 'recharts/types/component/Tooltip';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

export default function TriviaQuestionResultsBar({studentResults, triviaQuestions} : any) {

  const triviaQuestionResultsData = getTriviaQuestionResultsData(studentResults, triviaQuestions)

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      const index = triviaQuestionResultsData.find(
        (q:any) => q.questionNumber === label
      );
      const correctCount = Number(payload[0]?.value);
      const incorrectCount = Number(payload[1]?.value);
      const totalCount = correctCount + incorrectCount;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-question">{`${label} : ${index?.triviaQuestion.question}`}</p>
          <p className="tooltip-correct capitalize">{`Difficulty: ${index?.triviaQuestion.difficulty}`}</p>
          <p className="tooltip-correct">{`Correct: ${correctCount} (${getValuePercentage(correctCount, totalCount)}%)`}</p>
          <p className="tooltip-correct">{`Incorrect: ${incorrectCount} (${getValuePercentage(incorrectCount, totalCount)}%)`}</p>
        </div>
      );
    }
    return null;
  }

  return (
    <div className = "dataVisualization_chartBackground dataVisualization_barChart">
      <ResponsiveContainer width= "100%" height = "100%">
        <BarChart width={800} height={300} data={ triviaQuestionResultsData ?? [{questionNumber : '', question : '', correctAnswers : 0, incorrectAnswers: 0}]}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={"questionNumber"} stroke = {yellowColor}/>
          <YAxis stroke= {yellowColor} width = {20}/>
          <Tooltip content={<CustomTooltip />} />  
          <Legend />
          <Bar dataKey="correctAnswers" fill= {successColor}/>
          <Bar dataKey="incorrectAnswers" fill= {errorColor} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
