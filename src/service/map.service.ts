import express from 'express'

import { User, Campus, Walk } from '../../models'
import { serviceResult } from '../../constants/interface'
import ingredient from '../../constants/ingredient'

class MapService {
  constructor() {}

  getIngredient(name: string): serviceResult {
    if (name in ingredient) {
      const data = ingredient[name]
      return {
        status: 200,
        success: true,
        data: data,
        message: 'Get ingredient success!',
      }
    }

    return {
      status: 400,
      success: false,
      message: `${name} lab does not exist`,
    }
  }
}

export default new MapService()
