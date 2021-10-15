import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

import { User, Walk } from '../../models'
import { serviceResult } from '../../constants/interface'
import mailer from '../utils/mailer'

class AuthService {
  constructor() {}

  async signup(userData): Promise<serviceResult> {
    const { password }: { password?: string } = userData
    try {
      const hashPassword: string = await bcrypt.hash(password, 12)
      const user = await User.create(
        {
          name: userData.name,
          email: userData.email,
          nickname: userData.nickname,
          password: hashPassword,
          campusId: userData.campusId,
          Walk,
        },
        {
          include: [{ model: Walk }],
        },
      )
      return {
        status: 200,
        success: true,
        message: 'User create success',
        data: { name: user.name, email: user.email, campusId: user.campusId },
      }
    } catch (err) {
      console.log(err)
      return { status: 400, success: false, message: 'user create failed' }
    }
  }

  async login(email: string, password: string): Promise<serviceResult> {
    let user: any = null
    try {
      user = await User.findOne({ where: { email: email } })
    } catch (e) {
      console.error(e)
      return { status: 400, success: false, message: 'db connection error' }
    }
    if (!user) {
      return { status: 404, success: false, message: 'User does not exist' }
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return { status: 401, success: false, message: 'Invalid password' }
    }

    const payload = { id: user.id, email: user.email, name: user.name }
    const secret_key = process.env.JWT_SECRET || 'testkey123'
    const token = jwt.sign(payload, secret_key)

    return {
      status: 200,
      success: true,
      message: 'login success',
      token: token,
    }
  }

  sendEmail(email: string): string {
    let randomNumber = ''

    for (let i = 0; i < 6; i++)
      randomNumber += Math.floor(Math.random() * 10).toString()

    mailer
      .sendMail({
        from: 'Lets-Walk Team',
        to: email,
        subject: '[Lets-Walk] Registration Authentication',
        text: `인증번호 : [${randomNumber}]`,
      })
      .then(() => {
        console.log(`${email}로 인증번호 전송 완료. 인증번호 : ${randomNumber}`)
      })

    return randomNumber
  }

  async email_validation(email: string): Promise<serviceResult> {
    let user: any = null
    try {
      user = await User.findOne({ where: { email: email } })
    } catch (e) {
      console.error(e)
      return { status: 400, success: false, message: 'db connection error' }
    }

    if (user) {
      return {
        status: 400,
        success: false,
        message: 'This email already exists',
      }
    }

    let authCode = '000000'

    // authCode = this.sendEmail(email)

    /* 메일 인증할 땐 위 코드 주석풀고 사용하면 됨.
    개발환경에서는 '00000' 리턴함*/

    return {
      status: 200,
      success: true,
      message: 'email validation success',
      data: authCode,
    }
  }
}

export default new AuthService()
