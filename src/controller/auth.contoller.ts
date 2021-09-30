import express from 'express'

import AuthService from '../service/auth.service'

const authController = express.Router()

authController.post('/sign-up', async (req, res) => {
  const userData = req.body

  const result = await AuthService.signup(userData)
  if (result.status) return res.status(result.status).json(result)
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

authController.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res
      .status(400)
      .json({ status: 400, message: 'email or password not exist' })
  }

  const result = await AuthService.login(email, password)
  if (result.status) return res.status(result.status).json(result)
})
export default authController
