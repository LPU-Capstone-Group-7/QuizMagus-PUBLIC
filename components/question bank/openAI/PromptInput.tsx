import React, { useState } from 'react'
import { Button, Form, InputGroup } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { splitQuizGptResponse } from '../../../src/utils'

export default function PromptInput({promptInput, setPromptInput, addQuestion, setAddQuestion} : {promptInput: string, setPromptInput : any, addQuestion : any[], setAddQuestion : any}) {

    const [loading, setLoading] = useState<boolean>(false)
    async function submitPromptHandler(){
        setLoading(true)

        const response = await fetch('/api/quiz-gpt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: promptInput
            })
        }).then((response) => response.json());
        setLoading(false)

        if(response.text && response.text != "NO"){
            try{
                setAddQuestion(splitQuizGptResponse(response.text))
                console.log(splitQuizGptResponse(response.text))
                console.log(response.text)
            }
            catch(error){
                toast.error(response.text);
            }
            
        }
    }
  return (
    <InputGroup className = "prompt_container">
        <Form.Control style={{ width: '20rem' }}
            className="prompt"
            placeholder = {"Make me a xx item quiz about..."}
            onChange = {(event) => {setPromptInput(event.target.value)}}
            max= {50}
        />
        <Button variant = "secondary" onClick = {submitPromptHandler} disabled = {loading}>
            <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M18.07 8.509l-8.56-4.28c-5.75-2.88-8.11-.52-5.23 5.23l.87 1.74c.25.51.25 1.1 0 1.61l-.87 1.73c-2.88 5.75-.53 8.11 5.23 5.23l8.56-4.28c3.84-1.92 3.84-5.06 0-6.98zm-3.23 4.24h-5.4c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h5.4c.41 0 .75.34.75.75s-.34.75-.75.75z"
                    fill="#6D1CFF"
                />
            </svg>
        </Button>
    </InputGroup>
  )
}
