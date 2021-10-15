import express from 'express'

import MapService from '../service/map.service'

const mapController = express.Router()

mapController.get('/lab', (req, res) => {
  const { name }: { name?: string } = req.query

  let result
  if (name) {
    result = MapService.getIngredientByName(name)
  } else {
    result = MapService.getAllIngredient()
  }

  if (result.status) return res.status(result.status).json(result)
})

export default mapController
