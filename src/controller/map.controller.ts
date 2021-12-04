import express from 'express'
import mapService from '../service/map.service'

import MapService from '../service/map.service'

const mapController = express.Router()

mapController.get('/marker', (req, res) => {
  const { lat, lng }: { lat?: string; lng?: string } = req.query
  if (!lat || !lng)
    return res.status(400).json({
      status: 400,
      success: false,
      message: 'check your location data',
    })

  const result = mapService.getMarkerList(parseFloat(lat), parseFloat(lng))

  if (result.status) return res.status(result.status).json(result)
})

export default mapController
