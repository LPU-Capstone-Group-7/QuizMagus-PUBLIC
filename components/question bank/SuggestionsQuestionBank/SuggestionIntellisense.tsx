import React from 'react'
import { Dropdown } from 'react-bootstrap'
import { containsSubstring } from '../../../src/utils';

interface SuggestionIntellisenseProps {
  question: string;
  addQuestion : any[];
changeMemberFields : any;
}

export default function SuggestionIntellisense({ question, addQuestion, changeMemberFields}: SuggestionIntellisenseProps) {

  function containsThisKeyword(sentence: string, substring: string): boolean {
    if (substring === "" || substring.length === 0) {
      return false;
    }
  
    return containsSubstring(sentence, substring);
  }
  
  return (
    <>
      {addQuestion.map((item: any, index: number) => (
        containsThisKeyword(item.question, question) && (
          <Dropdown.Item key={index} onClick = {() => changeMemberFields(item)}>
            <div className="question_intellisense">
              <p> {item.question} </p>
            </div>
          </Dropdown.Item>
        )
      ))}
    </>
  );
}

