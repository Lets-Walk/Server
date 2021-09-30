import express from 'express'
import bcrypt from 'bcrypt'

import db from '../../models'

class AuthService {
  constructor() {}

  async signup(userData) {
    const { password } = userData
    const hashPassword = await bcrypt.hash(password, 12)

    try {
      await db.User.create({
        name: userData.name,
        email: userData.email,
        nickname: userData.nickname,
        password: hashPassword,
        CampusId: userData.campusId,
      })
      return { success: true }
    } catch (err) {
      console.error(err)
      return {
        success: false,
        message: 'DB Create fail',
      }
    }
  }

  async email_validation(email) {
    //TODO :: nodemail통해 mail인증 구현하기, 메일 validation
    //일단은 인증코드로 0000 return 하는걸로
    return { code: '0000' }
  }
}

export default new AuthService()
