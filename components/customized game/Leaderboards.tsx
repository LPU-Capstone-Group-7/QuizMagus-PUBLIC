import React from 'react'

export default function Leaderboards({studentResults} : {studentResults : any}) {
    
  return (
    <>
    <div className="leaderboards_container">
      <table className='table-zebra'> 
        <thead>
          <tr>
            <th> </th>
            <th> Rank </th>
            <th> Name </th>
            <th> Attempts </th>
            <th> Grade </th>
          </tr>
        </thead>

        <tbody> 
          {studentResults.map((item : any, index : any) => {
            return (
              <tr key={index}>
                <td className='leaderboards_icon4'> <div className="leaderboards_image4"></div> </td>
                <th> {index + 4} </th>
                <th> {item.name} </th>
                <th> {item.numberOfAttempts} </th>
                <th> {item.totalGrade} </th>
              </tr>
            )
          })}
        </tbody>
      </table>

    </div>
    </>
  )
}
