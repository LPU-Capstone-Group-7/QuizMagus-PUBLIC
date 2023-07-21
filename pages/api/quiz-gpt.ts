import { NextApiRequest, NextApiResponse } from 'next';
import {Configuration, OpenAIApi} from 'openai'
import { OPEN_AI_KEY, promptContext } from '../../src/constants';


type ResponseData = {
    text: string;
};

interface GenerateNextApiRequest extends NextApiRequest{
    body:{
        prompt: string;
    };
}

export const openAI = new OpenAIApi(new Configuration({
    apiKey: OPEN_AI_KEY
}))

export default async function handler(
    req: GenerateNextApiRequest,
    res: NextApiResponse<ResponseData>
){
    const prompt = req.body.prompt;

    if(!prompt || prompt === ''){
        return new Response('Please send your prompt', {status: 400})
    }

    // https://platform.openai.com/docs/api-reference/completions/create
    const aiResponse  = await openAI.createCompletion({
        model: "text-davinci-003",
        prompt: `"${prompt}" ${promptContext}`,
        temperature: 0.9,       //HIGHER VALUES MEANS MODEL WOULD ANSWER MORE RANDOMLY
        max_tokens: 3000,       //MAX TOKENS TO GENERATE THE COMPLETION
        frequency_penalty: 1, //-2.0 TO 2.0, HIGHER VALUE MEANS MODEL WOULD LESS REPEAT TEXT BUT HIGHER TOKEN COST
        presence_penalty: 0     //-2.0 TO 2.0 INCREASES MODEL LIKELIHOOD TO TALK ABOUT NEW TOPICS
    
    })

    const response = aiResponse.data.choices[0].text?.trim() || 'Oops, something went wrong (╥﹏╥)'
    res.status(200).json({text: response});
}