import express from 'express'

import { User, Campus, Walk } from '../../models'
import { serviceResult } from '../../constants/interface'

class UserService {
  constructor() {}

  async getUser(id: number): Promise<serviceResult> {
    try {
      const user = await User.findOne({
        where: { id },
        attributes: ['id', 'name', 'nickname'],
        include: [
          { model: Walk, attributes: ['stepcount', 'wmcount'] },
          { model: Campus, attributes: ['id', 'name'] },
        ],
      })
      if (!user)
        return { status: 404, success: false, message: 'this user not exist' }

      return {
        status: 200,
        success: true,
        message: 'user inquiry success',
        data: user,
      }
    } catch (e) {
      console.error(e)
      return { status: 400, success: false, message: 'db connection error' }
    }
  }
}

export default new UserService()
