import express from 'express'

import AuthService from '../service/auth.service'

const authController = express.Router()

authController.post('/sign-up', async (req, res) => {
  const userData = req.body

  res.send(await AuthService.signup(userData))
})

authController.post('/email', async (req, res) => {
  const { email } = req.body
  if (!email) {
    res.status(400).send('email does not exist')
    return
  }
  const code = await AuthService.email_validation(email)
  res.send(code)
})

export default authController
