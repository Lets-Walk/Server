import express from 'express'

import AuthService from '../service/auth.service'

const campusController = express.Router()

campusController.get('/', async (req, res) => {})

export default campusController
