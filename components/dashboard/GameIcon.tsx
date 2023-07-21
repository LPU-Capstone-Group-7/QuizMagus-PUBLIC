import React from 'react';

export default function GameIcon({ gameType } : {gameType : any}) {

switch (gameType) {
    case 'TriviaGame':
        return <div className="trivia_icon"></div>;
    case 'WordSearch':
        return <div className="wordsearch_icon"></div>;
    default:
        return <div className="crossword_icon"></div>;
    }
}
