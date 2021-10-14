import express from 'express'
import { serviceResult } from '../../constants/interface'

import UserService from '../service/user.service'

const userController = express.Router()

userController.get('/', async (req, res) => {
  const result: serviceResult = await UserService.getAllUsers()
  if (result.status) return res.status(result.status).json(result)
})

userController.get('/:id', async (req, res) => {
  const { id } = req.params
  if (!id) {
    return res.status(400).json({ status: 400, success: false })
  }

  const result = await UserService.getUser(parseInt(id))
  if (result.status) return res.status(result.status).json(result)
})

export default userController
