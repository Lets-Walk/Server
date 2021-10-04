import * as nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const mailer = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
})

export default mailer
