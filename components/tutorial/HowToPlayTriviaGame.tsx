import React, { useState } from 'react'
import Carousel from 'react-bootstrap/Carousel';

export default function HowToPlayTriviaGame() {
    console.log("HelloTrivia")
    const [index, setIndex] = useState(0);
    const handleSelect = (selectedIndex : any) => {
        setIndex(selectedIndex);
      };

  return (
    <Carousel activeIndex={index} onSelect={handleSelect}>
        <Carousel.Item>
            <div className="carousel_one">
                <h1> Trivia Game </h1>
                <div className="trivia_carousel_image"></div>
                <p> Welcome to the exciting world of trivia! Test your knowledge and challenge your friends in this engaging game of questions and guessing. Answer a wide range of interesting and thought-provoking questions from various categories.</p>
            </div>
        </Carousel.Item>
        <Carousel.Item>
            <div className="carousel_two">
                <h1> Guess the answers </h1>
                <div className="trivia_carousel_image2"></div>
                <p> Answer each question by typing in your guess. </p>
            </div>
        </Carousel.Item>
        <Carousel.Item>
            <div className="carousel_three">
                <h1> Time and hints </h1>
                <div className="trivia_carousel_image3"></div>
                <p> As time runs out, a hint will be provided. </p>
            </div>
        </Carousel.Item>
        <Carousel.Item>
            <div className="carousel_four">
                <h1> Mini-games </h1>
                <div className="trivia_carousel_image4"></div>
                <p> Look out for popping question marks! Click on them to play mini-games for hints or power-ups. </p>
            </div>
        </Carousel.Item>
        <Carousel.Item>
            <div className="carousel_five">
                <h1> Score summary </h1>
                <div className="trivia_carousel_image5"></div>
                <p> Once you finish, a summary of your score will be displayed </p>
            </div>
        </Carousel.Item>
    </Carousel>
  )
}
