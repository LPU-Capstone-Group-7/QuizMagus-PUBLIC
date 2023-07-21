import React from 'react'

export default function IndividualStudentResult({individualStudentResults, className, profileImage, gameRank} : {individualStudentResults : any, className : string, profileImage : string, gameRank : string}) {
  
    return (
    <>
    <div className = {className}>
      <div className="rank_position">
        <p> {gameRank} </p>
      </div>
      <div className = {`${profileImage} leaderboards_icon`}>
      </div>

      <div className="leaderboards_topcontainer">
        <p className='game_name'>{individualStudentResults.name}</p>
        <p className='game_points'>{individualStudentResults.totalGrade} Pts</p>
      </div>
    </div>
    </>
  )
}