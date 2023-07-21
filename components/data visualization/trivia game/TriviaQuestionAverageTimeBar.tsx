import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Legend, Bar, Tooltip } from "recharts";
import { yellowColor } from "../../../src/constants";
import { TriviaQuestion } from "../../../src/TriviaGame/TriviaGameObject";

export default function TriviaQuestionAverageTimeBar({questionsAverageTime} : {questionsAverageTime  : {questionNumber : string, 
                                                                                                        triviaQuestion : TriviaQuestion, 
                                                                                                        averageTimeToAnswer : number}[]}) {

  return (
    <div className = "dataVisualization_chartBackground dataVisualization_barChart">
        <ResponsiveContainer width= "100%" height = "100%">
            <BarChart width={800} height={300} data={questionsAverageTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={"questionNumber"} stroke = {yellowColor}/>
                <YAxis stroke= {yellowColor} width = {20} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const index = questionsAverageTime.find(
                        (q) => q.questionNumber === label
                      );
                      return (
                        <div className="custom-tooltip">
                          <p className="tooltip-question">
                            {` ${label}: ${index?.triviaQuestion.question}`}
                          </p>
                          <p className="tooltip-difficulty capitalize">
                            {`Difficulty: ${index?.triviaQuestion.difficulty}`}
                          </p>
                          <p className="tooltip-time">
                            {`Average time: ${payload[0].value} seconds`}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Bar dataKey="averageTimeToAnswer" fill= {yellowColor}/>
            </BarChart>
        </ResponsiveContainer>
    </div>
  )
}
