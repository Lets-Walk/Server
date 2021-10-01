import jwt from 'jsonwebtoken'

import { User } from '../../models'
import dotenv from 'dotenv'
dotenv.config()

const verifyToken = (jwtToken: string) => {
  const secret_key = process.env.JWT_SECRET || 'testkey123'
  try {
    const decoded = jwt.verify(jwtToken, secret_key)
    return decoded
  } catch (e) {
    return null
  }
}

const authUser = async (req, res, next) => {
  const token = req.headers?.authorization

  if (!token) {
    res
      .status(400)
      .json({ status: 400, success: false, message: 'token not exist' })
    return
  }

  const jwtToken = token.split('Bearer ')[1]
  try {
    const result = verifyToken(jwtToken)
    const { id } = result
    console.log(result)
    try {
      const user = await User.findOne({ where: { id } })
      req.token = jwtToken
      req.user = user.dataValues
      next()
    } catch (e) {
      return res
        .status(400)
        .json({ status: 400, success: false, message: 'user does not exist' })
    }
  } catch (e) {
    res
      .status(400)
      .json({ status: 400, success: false, message: 'jwt verify failed' })
  }
}

export default authUser
