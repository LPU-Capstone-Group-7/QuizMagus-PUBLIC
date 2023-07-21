import React, { useState } from 'react'
import { Carousel } from 'react-bootstrap';
import { CarouselStep, crossWordTutorial, triviaGameTutorial, wordSearchTutorial } from '../../src/constants';


export default function TutorialComponent({gameType} : {gameType : string}) {

    const [index, setIndex] = useState(0);
    const handleSelect = (selectedIndex : any) => { setIndex(selectedIndex);};

    function DisplayGame(){
        switch (gameType) {
            case "TriviaGame": return triviaGameTutorial;
            case "WordSearch" : return wordSearchTutorial
            case "CrossWord" : return crossWordTutorial

            default: return []
        }
    }

    return(
        <Carousel activeIndex={index} onSelect={handleSelect}
            nextIcon = {<span aria-hidden="true" className="carousel-control-next-icon custom-next" />} 
            prevIcon = {<span aria-hidden="true" className="carousel-control-next-icon custom-prev" />}
        >
            {DisplayGame().map((item : CarouselStep, key) => (
                <Carousel.Item key = {key}>
                    <div className= {item.carouselStep}>
                        <h1> {item.header} </h1>
                        <div className= {item.image}></div>
                        <p> {item.body}</p>
                    </div>
                </Carousel.Item>
            ))}
        </Carousel>
    )
}

