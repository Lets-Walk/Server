import express from 'express'

import CampusService from '../service/campus.service'
import { serviceResult } from '../../constants/interface'

const campusController = express.Router()

campusController.get('/', async (req, res) => {
  const { name }: { name?: string } = req.query

  let result: serviceResult = {}
  if (!name) {
    result = await CampusService.getAllCampus()
  } else {
    result = await CampusService.getOneCampus(name)
  }

  if (result.status) return res.status(result.status).json(result)
})

campusController.get('/:id/members', async (req, res) => {
  const { id } = req.params
  if (!id) {
    return res.status(400).json({ status: 400, success: false })
  }

  const result = await CampusService.getMembersById(parseInt(id))

  if (result.status) return res.status(result.status).json(result)
})
export default campusController
