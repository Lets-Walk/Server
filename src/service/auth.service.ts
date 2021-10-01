import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

import { User } from '../../models'
import { serviceResult } from '../../constants/interface'

class AuthService {
  constructor() {}

  async signup(userData): Promise<serviceResult> {
    const { password }: { password?: string } = userData
    try {
      const hashPassword: string = await bcrypt.hash(password, 12)
      const user = await User.create({
        name: userData.name,
        email: userData.email,
        nickname: userData.nickname,
        password: hashPassword,
        campusId: userData.campusId,
      })
      return {
        status: 200,
        success: true,
        message: 'User create success',
        data: { name: user.name, email: user.email, campusId: user.campusId },
      }
    } catch (err) {
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

    //TODO :: nodemail통해 mail인증 구현하기
    //일단은 인증코드로 0000 return 하는걸로

    return {
      status: 200,
      success: true,
      message: 'email validation success',
      data: '000000',
    }
  }
}

export default new AuthService()
