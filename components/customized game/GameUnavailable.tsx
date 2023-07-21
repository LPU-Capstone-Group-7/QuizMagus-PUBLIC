import React from "react"

export default function GameUnavailable() {

  return (
    <>
    <title> Game Unavailable </title>
    <div className="gamepage_container">
            <div className="unavailable_text">
                <h1> UH-OH. </h1>
                <h2> Game Unavailable </h2>
                <p> Patience is a virtue! The game will be available soon.</p>
            </div>
            <div className="unavailable_icon">
            </div>
        </div>
    </>
  )
}