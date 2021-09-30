import express from 'express'

import CampusService from '../service/campus.service'

const campusController = express.Router()

campusController.get('/', async (req, res) => {
  const { name } = req.query
  let result = null
  try {
    if (!name) {
      result = await CampusService.getAllCampus()
    } else {
      result = await CampusService.getOneCampus(name)
    }
  } catch (e) {
    return res.status(400).json({ status: 400, message: e })
  }

  res.status(200).json({ status: 200, message: 'success', data: result })
  //   if (result) {
  //     res.status(200).json({ status: 200, message: 'success', data: result })
  //   } else {
  //     res.status(400).json({ status: 400, message: 'campus does not exist' })
  //   }
})

export default campusController
