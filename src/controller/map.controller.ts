import express from 'express'

import MapService from '../service/map.service'

const mapController = express.Router()

mapController.get('/lab', (req, res) => {
  const { name }: { name?: string } = req.query

  if (!name) {
    return res
      .status(400)
      .json({ status: 400, success: false, message: 'lab name does not exist' })
  }

  const result = MapService.getIngredient(name)

  if (result.status) return res.status(result.status).json(result)
})

export default mapController
