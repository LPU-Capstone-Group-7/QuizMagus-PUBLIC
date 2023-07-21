import React, { useState } from 'react'
import Carousel from 'react-bootstrap/Carousel';

export default function HowToPlayWordSearcGame() {
    const [index, setIndex] = useState(0);
    const handleSelect = (selectedIndex : any) => {
        setIndex(selectedIndex);
      };
      
  return (
    <Carousel activeIndex={index} onSelect={handleSelect}>
        <Carousel.Item>
        <div className="carousel_one">
                <h1> Word Search Game </h1>
                <div className="word_carousel_image"></div>
                <p> Welcome to the captivating world of word search puzzles! Sharpen your observation skills and embark on a thrilling journey of finding hidden words in a grid. Scan the puzzle horizontally, vertically, and diagonally to locate the words cleverly hidden within the jumble of letters. </p>
            </div>
        </Carousel.Item>
        <Carousel.Item>
            <div className="carousel_two">
                <h1> Find the words </h1>
                <div className="word_carousel_image2"></div>
                <p>  Locate the hidden words in the grid. </p>
            </div>
        </Carousel.Item>
        <Carousel.Item>
            <div className="carousel_three">
                <h1> Answer choices </h1>
                <div className="word_carousel_image3"></div>
                <p> The word choices will be displayed on the right side below the question. When you find a correct word, it will be crossed out from the choices. As you guess correctly, the remaining answer choices will decrease, helping you solve more efficiently. </p>
            </div>
        </Carousel.Item>
        <Carousel.Item>
            <div className="carousel_four">
                <h1> Helping Hint </h1>
                <div className="word_carousel_image4"></div>
                <p> Need some help? Click the hint button to highlight the words for a split second, making them easier to spot. </p>
            </div>
        </Carousel.Item>
        <Carousel.Item>
            <div className="carousel_five">
                <h1> Score Summary </h1>
                <div className="word_carousel_image5"></div>
                <p> Once you finish, a summary of your score will be displayed. </p>
            </div>
        </Carousel.Item>
    </Carousel>
  )
}