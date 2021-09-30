import express from 'express'

import CampusService from '../service/campus.service'
import { CampusResult } from '../../constants/interface'

const campusController = express.Router()

campusController.get('/', async (req, res) => {
  const { name }: { name?: string } = req.query

  let result: CampusResult = {}
  if (!name) {
    result = await CampusService.getAllCampus()
  } else {
    result = await CampusService.getOneCampus(name)
  }

  if (result.status) return res.status(result.status).json(result)
})

export default campusController
