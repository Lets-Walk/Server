import express from 'express'

import UserService from '../service/user.service'

const userController = express.Router()

userController.get('/:id', async (req, res) => {
  const { id } = req.params
  if (!id) {
    return res.status(400).json({ status: 400, success: false })
  }

  const result = await UserService.getUser(parseInt(id))
  if (result.status) return res.status(result.status).json(result)
})

export default userController
