import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from "nodemailer"
import { emailOTPTemplate } from '../../src/constants';

type ResponseData = {
    message: string;
};
 
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>,
) {
    console.log(req.body)
    
    if(req.method == 'POST'){
        const data = req.body;
        console.log(data)
        try {
            //sendNodemailerSMTP(data.email, data.name)
            await main(data.email, data.name, data.otp)
            res.status(200).json({ message: 'Message sent successfully!' });
        } catch (error) {
            console.log(error)
            res.status(400).json({ message: 'Failed Sending Message' });
        }
    }

    res.status(400).json({message : 'Invalid Request Method'})

    
}


// async..await is not allowed in global scope, must use a wrapper
async function main(email : string, name : string, otp : string) {
  
    
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.QUIZMAGUS_ZOHO_EMAIL, // generated ethereal user
        pass: process.env.QUIZMAGUS_ZOHO_PASS, // generated ethereal password
      },tls: {
        rejectUnauthorized: false
      }
    });
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
    from: process.env.QUIZMAGUS_ZOHO_EMAIL, // sender address
      to: email, // list of receivers
      subject: "Hello " + name, // Subject line
      html: emailOTPTemplate(name, otp), // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}