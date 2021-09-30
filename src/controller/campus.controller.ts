import express from 'express'

import CampusService from '../service/campus.service'

const campusController = express.Router()

campusController.get('/', async (req, res) => {
  const { name } = req.query
  console.log(name)
  if (!name) {
    res.send(await CampusService.getAllCampus())
  } else {
    res.send(await CampusService.getOneCampus(name))
  }
})

export default campusController
