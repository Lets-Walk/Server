import express from 'express'
import AuthService from '../service/auth.service'

const authController = express.Router()

authController.get('/login', (req, res) => {
  res.send('hello')
  //   const data = req.body
  //   const result = AuthService.login(data)
  //   return result
})

export default authController
