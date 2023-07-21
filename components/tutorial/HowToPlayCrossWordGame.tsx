import React, { useState } from 'react'
import Carousel from 'react-bootstrap/Carousel';

export default function HowToPlayCrossWordGame() {
    const [index, setIndex] = useState(0);
    const handleSelect = (selectedIndex : any) => {
        setIndex(selectedIndex);
      };
      
  return (
    <Carousel activeIndex={index} onSelect={handleSelect}>
        <Carousel.Item>
        <div className="carousel_one">
                <h1> Crossword Game </h1>
                <div className="crossword_carousel_image">
                </div>
                <p> Welcome to the world of crossword puzzles! Sharpen your vocabulary and critical thinking skills as you dive into this classic word game. Unleash your inner wordsmith by filling in the blank spaces with letters to form words, based on the given clues. </p>
            </div>
        </Carousel.Item>
        <Carousel.Item>
            <div className="carousel_two">
                <h1> Guess the answers </h1>
                <div className="crossword_carousel_image2"></div>
                <p> Answer each question by typing in your guess. </p>
            </div>
        </Carousel.Item>
        <Carousel.Item>
            <div className="carousel_three">
                <h1> Guess the answers </h1>
                <div className="crossword_carousel_image3"></div>
                <p> Answer each question by typing in your guess. </p>
            </div>
        </Carousel.Item>
        <Carousel.Item>
            <div className="carousel_four">
                <h1> Guess the answers </h1>
                <div className="crossword_carousel_image4"></div>
                <p> Answer each question by typing in your guess. </p>
            </div>
        </Carousel.Item>
        <Carousel.Item>
            <div className="carousel_five">
                <h1> Guess the answers </h1>
                <div className="crossword_carousel_image5"></div>
                <p> Answer each question by typing in your guess. </p>
            </div>
        </Carousel.Item>
    </Carousel>
  )
}