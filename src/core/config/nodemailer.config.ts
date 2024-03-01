import nodemailer from 'nodemailer';
import { Response } from 'express';

export class mailConfig {
  public async verifyMail(email: string, otp: number, res: Response): Promise<void> {
    try {
      const transporter = nodemailer.createTransport({
        service:'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.email,
          pass: process.env?.password,
        },
        tls: {
          rejectUnauthorized: false
      }
      });

      // send mail
      let info = await transporter.sendMail({
        from: 'Office Mart',
        to: email,
        subject: 'Account verification',
        text: 'welcome',
        html: 
          `<p> Enter <b>${otp}</b> in the app to verify your email address </p> 
          <p>This code <b>Expires in 1 hour</b></p>`  
        
      });

      // If email sending is successful
      console.log('Email sent successfully');

      // Check if headers have already been sent before sending a response
      if (!res.headersSent) {
        res.status(200).json({
          status: 'success',
          message: 'OTP sent to your mail',
          email: email
        });
      }
    } catch (err) {
      // Handle errors if any during email sending
      console.error('Error sending email:', err);

      // Check if headers have already been sent before sending another response
      if (!res.headersSent) {
        res.status(402).json({
          status: 'error',
          message: 'Error sending email',
        });
      }
    }
  }

}