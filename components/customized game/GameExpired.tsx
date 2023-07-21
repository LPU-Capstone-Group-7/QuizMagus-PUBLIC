import React from "react"

export default function GameExpired() {

  return (
    <>
    <title> Game Expired </title>
    <div className="gamepage_container">
            <div className="expired_text">
                <h1> Whoops! </h1>
                <h2> Game Expired </h2>
                <p> Looks like the game has reached its end. Better luck next time!</p>
            </div>

            <div className="expired_icon">
            </div>
        </div>
    </>
    
  )
}