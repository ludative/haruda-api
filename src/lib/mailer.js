import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import config from '../../config'

dotenv.config()

export default async ({ to, subject, content }) => {
  const smtpTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: config.aws.mail.address,
      pass: process.env.GMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: `하루다 <${config.aws.mail.address}>`,
    to,
    subject,
    html: content
  };

  return new Promise((resolve, reject) => {
    smtpTransport.sendMail(mailOptions, (err, res) => {

      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
      smtpTransport.close();
    });
  })
}
