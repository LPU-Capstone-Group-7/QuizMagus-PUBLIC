import React from 'react'
import IndividualStudentResult from './IndividualStudentResult'

export default function TopLeaderboards({studentResults} : {studentResults : any}) {

  const placeHolderStudentResult : {name : string, totalGrade : number} = {name : "???", totalGrade : 0}
  
  return (
    <>
    <div className="topleaderboards_container">
      <IndividualStudentResult individualStudentResults = {studentResults[1] ?? placeHolderStudentResult}className = "second" profileImage = "leaderboards_image2" gameRank = "2nd"/>
      <IndividualStudentResult individualStudentResults = {studentResults[0] ?? placeHolderStudentResult} className = "first" profileImage = "leaderboards_image1" gameRank = "1st" />
      <IndividualStudentResult individualStudentResults = {studentResults[2] ?? placeHolderStudentResult} className = "third" profileImage = "leaderboards_image3" gameRank = "3rd"/>
    </div>
    </>
  )
}
